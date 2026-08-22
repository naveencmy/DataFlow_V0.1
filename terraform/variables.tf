# terraform/variables.tf
# ==============================================================================
# Terraform Variables - Dayflow HRMS GCP Infrastructure
# ==============================================================================

variable "project_id" {
  type        = string
  description = "The Google Cloud Project ID where resources will be provisioned."
}

variable "region" {
  type        = string
  description = "The default GCP region for Cloud Run and Artifact Registry."
  default     = "us-central1"
}

variable "artifact_repo_name" {
  type        = string
  description = "The name of the Artifact Registry repository."
  default     = "dayflow-hrms-repo"
}

variable "backend_service_name" {
  type        = string
  description = "The name of the backend Cloud Run service."
  default     = "dayflow-backend"
}

variable "frontend_service_name" {
  type        = string
  description = "The name of the frontend Cloud Run service."
  default     = "dayflow-frontend"
}

variable "database_url" {
  type        = string
  description = "PostgreSQL connection string to store securely in Secret Manager."
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  description = "JWT encryption key to store securely in Secret Manager."
  sensitive   = true
}

variable "backend_min_instances" {
  type        = number
  description = "Minimum number of Cloud Run backend container instances to avoid cold starts."
  default     = 1
}

variable "backend_max_instances" {
  type        = number
  description = "Maximum number of Cloud Run backend container instances for auto-scaling."
  default     = 10
}

variable "frontend_min_instances" {
  type        = number
  description = "Minimum number of Cloud Run frontend container instances."
  default     = 1
}

variable "frontend_max_instances" {
  type        = number
  description = "Maximum number of Cloud Run frontend container instances."
  default     = 10
}
