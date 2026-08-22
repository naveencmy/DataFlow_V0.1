# Dayflow HRMS — Enterprise DevOps & Cloud Infrastructure

[![Docker Compose](https://img.shields.io/badge/Docker-Compose%20v2-2496ED.svg?logo=docker)](https://docs.docker.com/compose/)
[![AWS ECS Fargate](https://img.shields.io/badge/AWS-ECS%20Fargate-FF9900.svg?logo=amazon-aws)](https://aws.amazon.com/ecs/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform%201.5%2B-623CE4.svg?logo=terraform)](https://www.terraform.io/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF.svg?logo=github-actions)](https://github.com/features/actions)
[![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus%20Metrics-E6522C.svg?logo=prometheus)](https://prometheus.io/)
[![Redis](https://img.shields.io/badge/Cache-Redis%207-DC382D.svg?logo=redis)](https://redis.io/)

An enterprise-grade, GitOps-aligned cloud infrastructure and automated CI/CD architecture for **Dayflow HRMS**. Built with zero-trust network segmentation, multi-stage non-root containerization, edge rate limiting, Prometheus observability, automated database backups, and Infrastructure-as-Code (Terraform).

---

## 🏛️ High-Level System Architecture

```mermaid
graph TD
    subgraph "Edge & Content Delivery Network"
        Users([Global Users / Employees]) -->|HTTPS / Port 443| CF[AWS CloudFront CDN + AWS WAF]
        CF -->|Static Assets / Cache 1yr| S3[Private S3 Bucket Frontend]
        CF -->|API Requests /api/*| ALB[AWS Application Load Balancer]
    end

    subgraph "Public Subnets (Multi-AZ)"
        ALB -->|Forward Port 8080| NAT[NAT Gateway]
    end

    subgraph "Private Application Subnets"
        ALB -->|Health Checked| ECS1[ECS Fargate Task - Backend 1]
        ALB -->|Health Checked| ECS2[ECS Fargate Task - Backend 2]
    end

    subgraph "Isolated Database Subnets"
        ECS1 -->|SQL / Port 5432| RDS[(RDS PostgreSQL Multi-AZ)]
        ECS2 -->|SQL / Port 5432| RDS
        ECS1 -->|Cache / Port 6379| Redis[(ElastiCache Redis Cluster)]
        ECS2 -->|Cache / Port 6379| Redis
    end

    subgraph "Security & Secrets Management"
        SM[AWS Secrets Manager] -.->|Inject DB_URL & JWT_SECRET| ECS1
        SM -.->|Inject DB_URL & JWT_SECRET| ECS2
        CW[CloudWatch Logs & Metrics] <--- ECS1
        CW <--- ECS2
    end
```

---

## 📦 Directory Structure

```
d:/HRMS/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # GitHub Actions CI: Lint, Test, Docker Build & Trivy Scan
│       └── deploy.yml                      # GitHub Actions CD: Migration, ECS Deployment, Health Probe & Rollback
├── docker-compose.yml                      # Local multi-container topology (app, web, db, redis, migrate)
├── docker-compose.prod.yml                 # Production multi-container topology with Certbot SSL
├── nginx/
│   ├── nginx.conf                          # Enterprise edge reverse proxy & rate limiter
│   └── conf.d/
│       └── default.conf                    # Virtual host, SPA fallback, API proxy & SSL challenge
├── infra/
│   ├── docs/
│   │   └── runbooks.md                     # SRE Runbooks: RPO 24h, RTO 1h, Rollback & Snapshot Recovery
│   └── terraform/                          # AWS Infrastructure as Code (IaC)
│       ├── main.tf                         # Provider configuration & backend setup
│       ├── variables.tf                    # Infrastructure variables
│       ├── vpc.tf                          # Multi-AZ VPC, Subnets & Security Groups
│       ├── ecs.tf                          # ECS Fargate Cluster, Task Definitions, ALB & Auto-scaling
│       ├── rds.tf                          # RDS PostgreSQL Multi-AZ with automated backups
│       ├── redis.tf                        # ElastiCache Redis Cluster
│       ├── s3_cloudfront.tf                # Private S3 Bucket, CloudFront CDN & OAC
│       ├── waf.tf                          # AWS WAF Web ACL (SQLi, XSS, Rate Limits)
│       ├── secrets.tf                      # Secrets Manager & IAM least-privilege roles
│       ├── outputs.tf                      # Resource URIs and DNS outputs
│       └── terraform.tfvars.example        # Sample environment values
├── backend/                                # REST API microservice (Node.js 20 + Express + Mongoose/Postgres + Redis)
│   ├── Dockerfile                          # Multi-stage non-root container (Node.js 20 Alpine)
│   ├── package.json                        # Pinned dependencies (prom-client, ioredis, express)
│   └── src/
│       ├── config/
│       │   ├── db.js                       # Database connection manager
│       │   ├── jwt.js                      # JWT configuration
│       │   └── redis.js                    # Resilient Redis connection manager with health check
│       ├── middleware/
│       │   ├── auth.middleware.js          # Authentication & user context
│       │   ├── error.middleware.js         # Error boundaries
│       │   ├── logger.middleware.js        # Structured JSON access logging
│       │   └── role.middleware.js          # RBAC (ADMIN vs EMPLOYEE)
│       ├── utils/
│       │   ├── logger.js                   # Structured logger
│       │   └── metrics.js                  # Prometheus custom metrics collector
│       └── server.js                       # Express server with /api/v1/health & /metrics
└── frontend/                               # Single Page Application (React 19 + Vite + Tailwind CSS)
    ├── Dockerfile                          # Multi-stage Vite build + Unprivileged Nginx Alpine runner
    ├── nginx.conf                          # Cloud Run / Container SPA Nginx config
    └── src/                                # Frontend UI components & pages
```

---

## ⚡ Quick Start: Local Multi-Container Development

Run the entire HRMS ecosystem (Backend, Frontend/Nginx, Database, Redis, and Database Seeder) in one command:

```bash
# 1. Start all services in detached mode
docker compose up -d

# 2. View running service health status
docker compose ps

# 3. View live structured logs
docker compose logs -f app

# 4. Stop and clean up containers
docker compose down
```

Access Points:
- **Frontend Web UI**: [http://localhost:80](http://localhost:80)
- **API Health Check**: [http://localhost:80/api/v1/health](http://localhost:80/api/v1/health)
- **Prometheus Metrics**: [http://localhost:80/metrics](http://localhost:80/metrics)

---

## 🚀 CI/CD Automation Workflows

### 1. Continuous Integration (`.github/workflows/ci.yml`)
Runs on every Pull Request and Push to `main`:
1. **Lint & Static Analysis**: ESLint and formatting checks.
2. **Test Suites**: Unit and integration test validation.
3. **Multi-Stage Docker Build**: Verifies container builds with commit SHA tags.
4. **Security Vulnerability Scan**: Trivy scan on filesystem & containers + `npm audit`.

### 2. Continuous Deployment (`.github/workflows/deploy.yml`)
Triggered automatically on version tags (`v*.*.*`) or manual dispatch:
1. **Build & Push**: Pushes multi-stage images to GitHub Container Registry (GHCR) or AWS ECR.
2. **Pre-flight DB Migration**: Runs one-off database migration container before starting new app tasks.
3. **Zero-Downtime Rolling Update**: Deploys new task definitions to AWS ECS Fargate.
4. **Smoke Test Health Probe**: Polls `GET /api/v1/health`.
5. **Automatic Rollback**: Automatically reverts to the previous revision if health check fails.

---

## ☁️ AWS Infrastructure Deployment (Terraform)

Provision the complete AWS cloud architecture (VPC, ECS Fargate, RDS PostgreSQL, ElastiCache Redis, S3, CloudFront CDN, and AWS WAF):

```bash
cd infra/terraform

# 1. Initialize Terraform
terraform init

# 2. Configure Environment Variables
cp terraform.tfvars.example terraform.tfvars
# (Populate terraform.tfvars with db_password, jwt_secret, etc.)

# 3. Review Plan & Apply
terraform plan
terraform apply -auto-approve
```

---

## 📊 Observability & Health Probes Reference

| Endpoint | Protocol | Purpose | Response |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/health` | HTTP/JSON | Comprehensive health check (Database state + Redis latency + memory) | `200 OK` (Status: UP) / `503 Service Unavailable` |
| `GET /metrics` | Prometheus Text | System CPU, memory, GC, HTTP request duration histograms, and active requests | Standard Prometheus exposition format |
| `GET /healthz` | HTTP/JSON | Kubernetes / ECS minimal liveness probe | `200 OK` (Status: HEALTHY) |
| `GET /api/health` | HTTP/JSON | Public service metadata endpoint | `200 OK` |

---

## 📚 SRE Operations & Runbooks

For incident response protocols, disaster recovery procedures, and database snapshot restorations, refer to [infra/docs/runbooks.md](file:///d:/HRMS/infra/docs/runbooks.md).
