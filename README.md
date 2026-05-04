# KubeIntent
AI Powered DevOps Application

## Local Kubernetes Setup

### Prerequisites

- Docker
- Minikube
- kubectl

### Run setup

```bash
npm run k8s:setup
```

This starts a local Minikube cluster, ensures the `dev` and `staging` namespaces exist, and provisions sample `payment-service` and `auth-service` deployments.

### Verify resources

```bash
kubectl get pods -n staging
kubectl get deployments -n dev
kubectl get deployments -n staging
kubectl get pods -n dev
```
