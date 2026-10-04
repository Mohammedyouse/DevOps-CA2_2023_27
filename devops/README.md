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

The GitHub Actions CI workflow automates:

1. Repository checkout.
2. Node.js environment setup.
3. Dependency installation.
4. TypeScript checking.
5. Application build.

The CI workflow completed successfully in GitHub Actions.

## 5. Docker Configuration

The Dockerfile defines a containerized build and production startup process. The `.dockerignore` file excludes unnecessary files and environment secrets from the build context.

Local Docker execution was not performed because Docker was unavailable on the working laptop.

## 6. Kubernetes Configuration

The Kubernetes configuration includes:

* Deployment with two replicas.
* Container port 5000.
* Readiness and liveness probes.
* Resource requests and limits.
* NodePort service configuration.

The Kubernetes manifests were validated through GitHub Actions.

## 7. Rolling Update and Rollback

A GitHub Actions workflow created a temporary Kubernetes cluster using Kind and demonstrated:

1. Initial deployment.
2. Rolling update.
3. Failed image rollout.
4. Rollback to the previous working revision.
5. Deployment status verification.

The demonstration used a temporary Nginx workload to verify Kubernetes behavior, not a live ZenGen application deployment.

## 8. Ansible Configuration

The Ansible playbook prepares an application server by:

* Installing required system packages.
* Creating the application directory.
* Creating a dedicated service user.
* Writing application configuration.

The playbook was prepared but not executed against a live server.

## 9. Monitoring

A Prometheus configuration was prepared with a 15-second scrape interval and a ZenGen target at `localhost:5000/metrics`.

The metrics endpoint and live Prometheus collection have not yet been verified.

## 10. Results

The CI build, Kubernetes manifest validation, and Kubernetes rollout/rollback demonstration workflows completed successfully in GitHub Actions.

## 11. Conclusion

This case study demonstrates automated build verification, Kubernetes manifest validation, and an automated rollout/rollback demonstration. Docker deployment, live Ansible execution, and Prometheus monitoring remain potential implementation extensions.

## 12. Evidence

Screenshots of successful GitHub Actions runs and relevant configuration files are included in the assignment evidence folder.
