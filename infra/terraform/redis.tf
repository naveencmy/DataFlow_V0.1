# infra/terraform/redis.tf
# ==============================================================================
# AWS ElastiCache Redis Cluster Configuration
# In-Memory Caching & Session Storage with Encryption
# ==============================================================================

# 1. ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "redis" {
  name        = "${var.project_name}-${var.environment}-redis-subnet-group"
  description = "Subnet group for Dayflow HRMS Redis cluster"
  subnet_ids  = aws_subnet.database[*].id

  tags = {
    Name = "${var.project_name}-${var.environment}-redis-subnet-group"
  }
}

# 2. Redis Parameter Group
resource "aws_elasticache_parameter_group" "redis" {
  name   = "${var.project_name}-${var.environment}-redis7-params"
  family = "redis7"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
}

# 3. Redis Replication Group
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.project_name}-${var.environment}-redis"
  description                   = "Dayflow HRMS Redis Replication Group"
  node_type                     = var.redis_node_type
  num_cache_clusters            = var.environment == "prod" ? 2 : 1
  parameter_group_name          = aws_elasticache_parameter_group.redis.name
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  security_group_ids            = [aws_security_group.redis.id]

  automatic_failover_enabled    = var.environment == "prod" ? true : false
  multi_az_enabled              = var.environment == "prod" ? true : false
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = false # Enable if TLS client is configured

  maintenance_window            = "sun:05:30-sun:06:30"
  snapshot_retention_limit      = 5
  snapshot_window               = "02:00-03:00"

  tags = {
    Name = "${var.project_name}-${var.environment}-redis"
  }
}
