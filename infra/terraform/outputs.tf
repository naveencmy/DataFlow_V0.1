# infra/terraform/outputs.tf
# ==============================================================================
# AWS Infrastructure Outputs - Dayflow HRMS
# ==============================================================================

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "cloudfront_distribution_domain" {
  description = "Global CloudFront Domain Name (Frontend URL)"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "alb_dns_name" {
  description = "Public DNS Name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  description = "Name of the ECS Cluster"
  value       = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  description = "Endpoint address of the RDS PostgreSQL instance"
  value       = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  description = "Primary endpoint address of the ElastiCache Redis cluster"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "s3_assets_bucket" {
  description = "Private S3 Bucket for Employee Documents"
  value       = aws_s3_bucket.employee_assets.id
}
