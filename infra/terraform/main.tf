# infra/terraform/main.tf
# ==============================================================================
# AWS Terraform Main Configuration - Dayflow HRMS
# High Availability Architecture: ECS Fargate + RDS + Redis + S3/CloudFront + WAF
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "SRE-DevOps"
    }
  }
}

# Current AWS Account & Region Data Sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
