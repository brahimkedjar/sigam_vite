Sigam Infrastructure (Docker + Kubernetes)

Overview
- Server: NestJS + Prisma + TypeORM (PostgreSQL)
- Client: Vite React (static, served via Nginx)
- Database: PostgreSQL 17 with persistent storage
- Backups: Daily CronJob creates compressed dumps, keeps 7 days
- Ingress: NGINX Ingress with two hosts (client + API)

Prerequisites
- Docker/Buildx on your build machine
- A container registry (e.g., GHCR, ECR, Docker Hub)
- Kubernetes cluster with storage class and NGINX Ingress installed
- kubectl configured for your cluster

1) Build and Push Images

Adjust registry/org and API URL, then build and push:

```bash
# from repo root

# Server image
docker build -t YOUR_REGISTRY/sigam/server:latest -f server/Dockerfile .
docker push YOUR_REGISTRY/sigam/server:latest

# Client image: define API base URL consumed at build-time by Vite
docker build \
  --build-arg VITE_API_URL=https://api.sigam.example.com \
  -t YOUR_REGISTRY/sigam/client:latest \
  -f client/Dockerfile \
  .
docker push YOUR_REGISTRY/sigam/client:latest
```

2) Configure Kubernetes

Edit the following files and replace placeholders:
- `infra/k8s/db-secret.yaml`: set `POSTGRES_PASSWORD` and `DATABASE_URL` to match
- `infra/k8s/server-deployment.yaml`: set `image: YOUR_REGISTRY/sigam/server:latest`
- `infra/k8s/client-deployment.yaml`: set `image: YOUR_REGISTRY/sigam/client:latest`
- `infra/k8s/ingress.yaml`: update hostnames; optionally configure TLS

3) Deploy

```bash
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/db-secret.yaml
kubectl apply -f infra/k8s/postgres-statefulset.yaml
kubectl apply -f infra/k8s/postgres-backup-pvc.yaml
kubectl apply -f infra/k8s/postgres-backup-cronjob.yaml

# Wait for Postgres to be Ready
kubectl get pods -n sigam -w

# Deploy backend and frontend
kubectl apply -f infra/k8s/server-deployment.yaml
kubectl apply -f infra/k8s/client-deployment.yaml

# Optionally expose via Ingress
kubectl apply -f infra/k8s/ingress.yaml
```

4) Migrations

The server Deployment includes an initContainer that runs `prisma migrate deploy` before the app starts. It reads `DATABASE_URL` from the Secret. Ensure your Secret has the correct `DATABASE_URL`.

5) Backups

- PVC: `postgres-backups` stores dumps
- CronJob: `postgres-backup` runs daily at 00:00, keeps last 7 days

List backup files:
```bash
kubectl -n sigam get pvc postgres-backups
kubectl -n sigam get cronjobs
kubectl -n sigam get pods -l job-name=postgres-backup-<timestamp>
```

Restore example (manual)
```bash
# Start a temporary psql pod with backups mounted
kubectl -n sigam run pg-restore --rm -it \
  --image=postgres:16 --restart=Never \
  --env="PGHOST=postgres.sigam.svc.cluster.local" \
  --env="PGUSER=$(kubectl -n sigam get secret postgres-credentials -o jsonpath='{.data.POSTGRES_USER}' | base64 -d)" \
  --env="PGPASSWORD=$(kubectl -n sigam get secret postgres-credentials -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d)" \
  --env="PGDATABASE=$(kubectl -n sigam get secret postgres-credentials -o jsonpath='{.data.POSTGRES_DB}' | base64 -d)" \
  --overrides='{"spec":{"volumes":[{"name":"backups","persistentVolumeClaim":{"claimName":"postgres-backups"}}],"containers":[{"name":"pg-restore","image":"postgres:16","command":["bash","-lc","ls -lah /backups && echo Choose a file and run: pg_restore -h $PGHOST -U $PGUSER -d $PGDATABASE -c -v /backups/FILE.dump"],"volumeMounts":[{"name":"backups","mountPath":"/backups"}]}]}}'
```

Notes
- The client reads API URL at build time via `VITE_API_URL`. Build client image once per environment.
- `server/src/app.module.ts` now reads TypeORM config from env, aligning with K8s env vars.
- If you already have an Ingress/Issuers, update annotations accordingly.
- Storage classes vary by cluster. Set `storageClassName` if needed.

