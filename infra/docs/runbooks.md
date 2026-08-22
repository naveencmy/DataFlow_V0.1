# Dayflow HRMS — SRE & Disaster Recovery Runbooks

This document outlines the Site Reliability Engineering (SRE) operational procedures, Disaster Recovery (DR) plans, backup schedules, and incident response playbooks for Dayflow HRMS.

---

## 🎯 Reliability & Recovery Targets

| Metric | Target | Mechanism |
| :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | **< 24 Hours** | Automated daily RDS/MongoDB snapshots + WAL replication |
| **Recovery Time Objective (RTO)** | **< 1 Hour** | Infrastructure as Code (Terraform) + Automated ECS rolling deployments |
| **Target Availability (SLA)** | **99.9% (~43m downtime/month)** | Multi-AZ ECS Fargate, Multi-AZ RDS, CloudFront Edge CDN |

---

## 🚨 Incident Response & Escalation Matrix

```mermaid
graph TD
    A[CloudWatch / Prometheus Alert] -->|Triggered| B{Severity Assessment}
    B -->|SEV-1 Critical Outage| C[Page On-Call SRE & Engineering Lead]
    B -->|SEV-2 Degraded Perf| D[Notify Slack #devops-alerts]
    B -->|SEV-3 Warning| E[Log to JIRA Incident Board]
    C --> F[Initiate Incident Command Room]
    F --> G[Run Diagnostics: /api/v1/health]
    G --> H{Issue Type}
    H -->|Bad Deployment| I[Execute Rollback Runbook]
    H -->|Database Corrupt/Down| J[Execute Database Recovery Runbook]
    H -->|Traffic Flood / DDoS| K[Enable AWS WAF Emergency Block]
```

---

## 🔄 Runbook 1: Automated & Manual Service Rollback

### Trigger Condition
- Deployment health check probe fails on `/api/v1/health`.
- HTTP 5xx error rate exceeds 1% for more than 3 consecutive minutes post-release.

### Procedure
1. **GitHub Actions Immediate Re-deployment**:
   Navigate to GitHub Actions → Select `CD Pipeline` → Trigger workflow targeting previous known stable version tag (e.g., `v1.0.4`).

2. **AWS ECS CLI Manual Rollback**:
   ```bash
   # 1. List previous active task definition revisions
   aws ecs list-task-definitions --family-prefix dayflow-hrms-prod-backend --sort DESC

   # 2. Update service to point to previous revision (e.g. revision 14)
   aws ecs update-service \
     --cluster dayflow-hrms-prod-cluster \
     --service dayflow-hrms-prod-service \
     --task-definition dayflow-hrms-prod-backend:14 \
     --force-new-deployment

   # 3. Monitor rollout status
   aws ecs wait services-stable \
     --cluster dayflow-hrms-prod-cluster \
     --services dayflow-hrms-prod-service
   ```

---

## 💾 Runbook 2: Database Snapshot Restoration

### Trigger Condition
- Accidental data deletion, corrupted tables, or database node failure.

### Procedure (AWS RDS PostgreSQL)
1. **Identify the Latest Clean Snapshot**:
   ```bash
   aws rds describe-db-snapshots \
     --db-instance-identifier dayflow-hrms-prod-postgres \
     --query "DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime]" \
     --output table
   ```

2. **Restore Snapshot to New Instance**:
   ```bash
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier dayflow-hrms-prod-postgres-restored \
     --db-snapshot-identifier rds:dayflow-hrms-prod-postgres-2026-08-22-03-00 \
     --db-subnet-group-name dayflow-hrms-prod-db-subnet-group \
     --vpc-security-group-ids sg-xxxxxxxxx \
     --no-publicly-accessible
   ```

3. **Switch Secrets Manager Pointer**:
   Update `DATABASE_URL` in AWS Secrets Manager:
   ```bash
   aws secretsmanager update-secret \
     --secret-id dayflow-hrms/prod/database_url \
     --secret-string "postgresql://dayflow_admin:PASSWORD@dayflow-hrms-prod-postgres-restored.cxxxxxx.us-east-1.rds.amazonaws.com:5432/dayflow_hrms"
   ```

4. **Restart ECS Backend Tasks**:
   ```bash
   aws ecs update-service \
     --cluster dayflow-hrms-prod-cluster \
     --service dayflow-hrms-prod-service \
     --force-new-deployment
   ```

---

## 📊 Runbook 3: Prometheus & CloudWatch Alert Triage

| Alert Name | Threshold | Root Cause / Action |
| :--- | :--- | :--- |
| `High5xxRate` | `> 1% for 5m` | Check ECS logs (`/ecs/dayflow-hrms-prod-backend`). Inspect database socket connection errors or unhandled promise rejections. |
| `HighMemoryUsage` | `> 85% for 10m` | Investigate Node.js memory leak via Prometheus `dayflow_hrms_nodejs_heap_size_used_bytes`. Scale ECS min capacity if traffic surge. |
| `DatabaseHighConnections` | `> 80 connections` | Check active connection leaks. Verify connection pool timeouts in `backend/src/config/`. |
| `RedisHighMemory` | `> 90% memory` | Inspect cache eviction policy (`maxmemory-policy allkeys-lru`). Clear non-essential cached keys. |

---

## 🛡️ Runbook 4: Emergency WAF IP Rate Limiting & Blocking

In case of a distributed denial-of-service (DDoS) or brute force attack against `/api/auth/login`:

1. **Check Top Ingress IPs via Nginx / CloudWatch JSON Logs**:
   ```bash
   aws logs filter-log-events \
     --log-group-name "/ecs/dayflow-hrms-prod-backend" \
     --filter-pattern '{ $.httpRequest.status = 401 }'
   ```

2. **Add Offending IP to AWS WAF Block List**:
   ```bash
   aws wafv2 update-ip-set \
     --name EmergencyBlockedIPs \
     --scope CLOUDFRONT \
     --id YOUR_IP_SET_ID \
     --addresses "198.51.100.0/24" \
     --lock-token YOUR_LOCK_TOKEN
   ```
