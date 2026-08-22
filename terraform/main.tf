# terraform/main.tf
# ==============================================================================
# Terraform GCP Infrastructure as Code (IaC) - Dayflow HRMS
# Architecture: Cloud Run + Artifact Registry + Secret Manager (PostgreSQL) + Least Privilege IAM
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.15"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ------------------------------------------------------------------------------
# 1. Enable Required GCP APIs
# ------------------------------------------------------------------------------
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "cloudtrace.googleapis.com",
  ])

  service            = each.key
  disable_on_destroy = false
}

# ------------------------------------------------------------------------------
# 2. Google Artifact Registry (Docker Repositories)
# ------------------------------------------------------------------------------
resource "google_artifact_registry_repository" "hrms_repo" {
  depends_on    = [google_project_service.required_apis]
  provider      = google
  location      = var.region
  repository_id = var.artifact_repo_name
  description   = "Docker container repository for Dayflow HRMS backend & frontend"
  format        = "DOCKER"
}

# ------------------------------------------------------------------------------
# 3. Google Secret Manager (Encrypted PostgreSQL Credentials & JWT)
# ------------------------------------------------------------------------------
resource "google_secret_manager_secret" "database_url" {
  depends_on = [google_project_service.required_apis]
  secret_id  = "DAYFLOW_DATABASE_URL"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "database_url_val" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = var.database_url
}

resource "google_secret_manager_secret" "jwt_secret" {
  depends_on = [google_project_service.required_apis]
  secret_id  = "DAYFLOW_JWT_SECRET"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "jwt_secret_val" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = var.jwt_secret
}

# ------------------------------------------------------------------------------
# 4. Service Accounts (Least Privilege IAM)
# ------------------------------------------------------------------------------
resource "google_service_account" "backend_sa" {
  account_id   = "dayflow-backend-sa"
  display_name = "Dayflow Backend Cloud Run Runtime SA"
  description  = "Dedicated Service Account for Dayflow HRMS Backend container"
}

resource "google_service_account" "frontend_sa" {
  account_id   = "dayflow-frontend-sa"
  display_name = "Dayflow Frontend Cloud Run Runtime SA"
  description  = "Dedicated Service Account for Dayflow HRMS Frontend container"
}

# Grant backend SA permissions for Structured Logging & Cloud Trace
resource "google_project_iam_member" "backend_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_project_iam_member" "backend_trace" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

# Grant backend SA access to specific secrets only (Least Privilege)
resource "google_secret_manager_secret_iam_member" "backend_db_access" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "backend_jwt_access" {
  secret_id = google_secret_manager_secret.jwt_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_sa.email}"
}

# ------------------------------------------------------------------------------
# 5. Cloud Run - Backend REST API Service
# ------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "backend" {
  depends_on = [
    google_project_service.required_apis,
    google_secret_manager_secret_version.database_url_val,
    google_secret_manager_secret_version.jwt_secret_val,
  ]

  name     = var.backend_service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.backend_sa.email

    scaling {
      min_instance_count = var.backend_min_instances
      max_instance_count = var.backend_max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo_name}/backend:latest"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }

      # Liveness and Readiness Probes for Cloud Run Container Health
      liveness_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        initial_delay_seconds = 10
        period_seconds        = 30
        timeout_seconds       = 5
        failure_threshold     = 3
      }

      startup_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        timeout_seconds       = 5
        failure_threshold     = 5
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# ------------------------------------------------------------------------------
# 6. Cloud Run - Frontend Single Page Application Service
# ------------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "frontend" {
  depends_on = [
    google_project_service.required_apis,
    google_cloud_run_v2_service.backend,
  ]

  name     = var.frontend_service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.frontend_sa.email

    scaling {
      min_instance_count = var.frontend_min_instances
      max_instance_count = var.frontend_max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo_name}/frontend:latest"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1000m"
          memory = "256Mi"
        }
      }

      liveness_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        initial_delay_seconds = 5
        period_seconds        = 30
        timeout_seconds       = 3
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# ------------------------------------------------------------------------------
# 7. Public Ingress Access IAM Policies (Cloud Run Unauthenticated Invocation)
# ------------------------------------------------------------------------------
resource "google_cloud_run_service_iam_member" "backend_public" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
