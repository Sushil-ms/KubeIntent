# KubeIntent
AI Powered DevOps Application

## Environment Setup

Create a local environment file:

```bash
touch .env.local
```

Add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

When `OPENAI_API_KEY` is present, the parse API uses the OpenAI-backed parser for natural language commands. If the key is missing, or the OpenAI request fails, KubeIntent falls back to the existing mock parser.

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
