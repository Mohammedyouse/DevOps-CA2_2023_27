# ZenGen – DevOps Case Study

## 1. Project Overview

ZenGen is a mental health prediction platform. This case study demonstrates DevOps practices for application build automation, containerization, Kubernetes configuration, configuration management, and monitoring.

## 2. Objectives

* Automate application build verification using GitHub Actions.
* Prepare Docker configuration for containerization.
* Validate Kubernetes deployment and service manifests.
* Demonstrate Kubernetes rolling updates and rollback.
* Prepare Ansible configuration management.
* Prepare Prometheus monitoring configuration.

## 3. Technologies Used

* Git and GitHub
* GitHub Actions
* Docker
* Kubernetes
* Ansible
* Prometheus
* YAML
* Node.js

## 4. CI Pipeline

No `.github/workflows` directory is present in this repository checkout, so there is no GitHub Actions workflow definition to inspect or run here. Earlier statements about a successful CI run cannot be verified from this checkout.

## 5. Docker Configuration

The Dockerfile defines a containerized build and production startup process. Its Node.js base image is Node 22, which satisfies the monitoring client's supported engine range. The root `.dockerignore` excludes local environment files from the image build context. The ZenGen Docker image built successfully and the application container became healthy against Neon.

## 6. Kubernetes Configuration

The Kubernetes configuration includes:

* Deployment with two replicas.
* Container port 5000.
* Readiness and liveness probes.
* Resource requests and limits.
* NodePort service configuration.

The Kubernetes manifests are present, but this checkout has no workflow definition to validate them automatically. Their live application deployment has not been verified here.

## 7. Rolling Update and Rollback

No GitHub Actions workflow source for a Kind rollout/rollback demonstration is present in this checkout. The Kubernetes manifests describe ZenGen; a live ZenGen cluster deployment was not performed.

## 8. Ansible Configuration

The Ansible playbook prepares an application server by:

* Installing required system packages.
* Creating the application directory.
* Creating a dedicated service user.
* Writing application configuration.

The playbook was prepared but not executed against a live server.

## 9. Monitoring

### Implementation and verification status

| Status | Item |
| --- | --- |
| Implemented and verified | ZenGen exposes `/metrics` using `@prometheus-io/client`. Live HTTP requests confirmed process uptime, request totals, 4xx errors, and latency histogram samples. The metrics middleware excludes `/metrics` and uses only normalized method and status-code labels. |
| Implemented and verified | The Neon `ZenGen` project was created in `aws-ap-southeast-1` (Singapore), PostgreSQL 17. Drizzle's existing schema was applied without resetting the database; the `users`, `assessments`, `chat_messages`, and `resources` tables were verified. |
| Implemented and verified | Prometheus v3.5.0 reports the `zengen` scrape target UP. Grafana 12.1.0 is healthy, its provisioned Prometheus datasource health is OK, and the provisioned dashboard contains exactly the five required panels. |
| Implemented and verified | Generated HTTP traffic produced live data for all five Prometheus expressions: uptime, request total, request rate, p95 latency, and 4xx/5xx error rate. The final Prometheus check observed 187 requests, approximately 0.89 requests/second, approximately 0.0475 seconds p95 latency, and nonzero error rate from intentional unauthenticated 401 test traffic. |
| Implemented and verified | `npm install`, `npm run db:push`, `npm run check`, `npm run build`, Prometheus `promtool check config`, Docker Compose configuration validation, Docker image build, and service health checks completed successfully. |
| Evidence | Screenshots of the live `/metrics` response, Prometheus target UP, and the Grafana dashboard were captured in the interactive session. They are not stored as image files in the repository. |

ZenGen's existing `@neondatabase/serverless` driver reads `DATABASE_URL` from the environment. A local root `.env` file supplies it to Compose through the service `env_file`; `.env` is ignored by Git and Docker. The committed `.env.example` contains only a placeholder. No real connection string, session secret, or API key is tracked.

The monitoring stack binds application, Prometheus, and Grafana ports to `127.0.0.1`. Grafana anonymous access is read-only. The session secret is generated locally and stored alongside `DATABASE_URL` in the ignored `.env`.

### Run the stack (PowerShell)

In the repository root, set the existing Neon connection string in the ignored `.env` file without printing it. This example prompts for it as a secure string:

```powershell
Set-Location -LiteralPath 'D:\SYMBIOSIS UNIVERSITY\Final Year\Seventh Semester\DevOps +Lab\project\DevOps-CA2_2023_27-main'
$secureDbUrl = Read-Host "Enter the Neon DATABASE_URL" -AsSecureString
$databaseUrl = [System.Net.NetworkCredential]::new("", $secureDbUrl).Password
$secureGeminiKey = Read-Host "Enter the Gemini API key" -AsSecureString
$geminiApiKey = [System.Net.NetworkCredential]::new("", $secureGeminiKey).Password
$sessionSecret = [guid]::NewGuid().ToString("N")
Set-Content -Path .env -Value @("DATABASE_URL=$databaseUrl", "SESSION_SECRET=$sessionSecret", "GEMINI_API_KEY=$geminiApiKey") -Encoding Ascii
Remove-Variable secureDbUrl,databaseUrl,secureGeminiKey,geminiApiKey,sessionSecret
npm.cmd run db:push
docker compose -f devops/monitoring/docker-compose.yml up --build -d
docker compose -f devops/monitoring/docker-compose.yml ps
```

`db:push` applies the checked-in Drizzle schema to the selected Neon database. Do not run it against a production database without reviewing the schema change first. Never add secrets to `.env.example`, source files, or Git.

Generate successful and expected unauthenticated requests so the traffic and error panels have data:

```powershell
1..30 | ForEach-Object {
  curl.exe -s -o NUL http://127.0.0.1:5000/
  curl.exe -s -o NUL http://127.0.0.1:5000/api/user
}
curl.exe -f http://127.0.0.1:5000/metrics
Invoke-RestMethod http://127.0.0.1:9090/api/v1/targets
```

`/api/user` returns 401 when no user session is supplied; that expected response contributes to the HTTP error metric. Confirm the `zengen` target reports `health: "up"` in Prometheus at <http://127.0.0.1:9090/targets>. Open the provisioned **ZenGen Application Monitoring** dashboard at <http://127.0.0.1:3000/d/zengen-monitoring/zengen-application-monitoring>. The five panels are **Application Uptime**, **Total HTTP Requests**, **Request Rate**, **P95 Request Latency**, and **Error Rate**.

### CA-II screenshots to capture after end-to-end verification

1. Grafana's **ZenGen Application Monitoring** dashboard after generating requests, with all five panels and real values visible.
2. Prometheus **Status → Targets** showing the `zengen` target as **UP** and its last scrape error empty.
3. The ZenGen `/metrics` response showing `process_uptime_seconds`, `http_requests_total`, `http_errors_total`, and `http_request_duration_seconds` samples.
4. Optionally, `docker compose ps` showing ZenGen healthy and Prometheus/Grafana running.

Stop the stack with `docker compose -f devops/monitoring/docker-compose.yml down`. Use `down --volumes` only if you also intend to delete the stored Prometheus and Grafana data.

## 13. Netlify Production Deployment

| Status | Item |
| --- | --- |
| Configured, not deployed or verified | `netlify.toml` builds the Vite frontend and routes `/api/*`, `/health`, and `/metrics` to a Netlify Function wrapping the Express application. |
| Required before deployment | Set `DATABASE_URL`, `SESSION_SECRET`, and `GEMINI_API_KEY` as private Netlify site environment variables. Never put their values in `netlify.toml`, frontend code, or Git. |
| Not verified | Netlify account/site authorization, production database access, Gemini responses, and the public website. A Gemini key has not yet been saved to the local environment. |
| Separate monitoring | The Prometheus/Grafana stack documented above monitors the local Docker deployment only. It does not monitor Netlify Functions. |

The Express API uses `serverless-http` through `netlify/functions/api.mjs`; the frontend continues to use same-origin `/api/...` URLs. The configured Gemini model is `gemini-3.6-flash` and is listed in Google's [Gemini API model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash). A production deployment and chatbot response must still be tested after the required private environment variables and Netlify authorization are available.

## 10. Results

Live application, database schema, Prometheus scrape, Grafana datasource, and all five dashboard queries were verified. TypeScript checking, the production build, Prometheus configuration validation, dashboard JSON validation, and Docker Compose startup also passed. The `npm install` audit reports 25 dependency findings (2 low, 6 moderate, 16 high, and 1 critical); those existing dependency findings were not automatically changed as part of monitoring.

## 11. Conclusion

The Neon-backed monitoring stack has been run end-to-end. No GitHub Actions workflow files are present in this checkout. Kubernetes deployment and live Ansible execution remain unverified.

## 12. Evidence

Monitoring screenshots were captured in the interactive session; screenshot image files were not added to the repository. See section 9 for the evidence items and optional container-status capture.
