# terraform/outputs.tf
# ==============================================================================
# Terraform Outputs - Dayflow HRMS GCP Infrastructure
# ==============================================================================

output "artifact_registry_repository" {
  description = "The URI of the Artifact Registry Docker repository."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo_name}"
}

output "backend_cloud_run_url" {
  description = "Public URL of the backend Cloud Run service."
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_cloud_run_url" {
  description = "Public URL of the frontend Cloud Run service."
  value       = google_cloud_run_v2_service.frontend.uri
}

output "backend_service_account" {
  description = "Dedicated Service Account email used by the backend."
  value       = google_service_account.backend_sa.email
}

output "frontend_service_account" {
  description = "Dedicated Service Account email used by the frontend."
  value       = google_service_account.frontend_sa.email
}
