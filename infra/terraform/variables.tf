# infra/terraform/variables.tf
# ==============================================================================
# AWS Infrastructure Variables - Dayflow HRMS Enterprise Stack
# ==============================================================================

variable "aws_region" {
  type        = string
  description = "AWS deployment region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Target deployment environment (dev, staging, prod)"
  default     = "prod"
}

variable "project_name" {
  type        = string
  description = "Project identifier used in naming resources"
  default     = "dayflow-hrms"
}

variable "domain_name" {
  type        = string
  description = "Root domain name (e.g., dayflow.io)"
  default     = "dayflow.io"
}

# ------------------------------------------------------------------------------
# Networking Variables
# ------------------------------------------------------------------------------
variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones for high availability"
  default     = ["us-east-1a", "us-east-1b"]
}

# ------------------------------------------------------------------------------
# Compute & ECS Variables
# ------------------------------------------------------------------------------
variable "backend_cpu" {
  type        = number
  description = "Fargate task CPU units (1024 = 1 vCPU)"
  default     = 1024
}

variable "backend_memory" {
  type        = number
  description = "Fargate task memory in MB"
  default     = 2048
}

variable "backend_min_capacity" {
  type        = number
  description = "Minimum number of ECS backend tasks"
  default     = 2
}

variable "backend_max_capacity" {
  type        = number
  description = "Maximum number of ECS backend tasks for auto-scaling"
  default     = 10
}

# ------------------------------------------------------------------------------
# Database & Cache Variables
# ------------------------------------------------------------------------------
variable "db_instance_class" {
  type        = string
  description = "RDS instance class"
  default     = "db.t3.small"
}

variable "db_allocated_storage" {
  type        = number
  description = "Allocated storage in GB for RDS"
  default     = 20
}

variable "db_name" {
  type        = string
  description = "Database name"
  default     = "dayflow_hrms"
}

variable "db_username" {
  type        = string
  description = "Master database username"
  default     = "dayflow_admin"
}

variable "db_password" {
  type        = string
  description = "Master database password"
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  description = "JWT encryption key for token generation"
  sensitive   = true
}

variable "redis_node_type" {
  type        = string
  description = "ElastiCache Redis node type"
  default     = "cache.t3.micro"
}
