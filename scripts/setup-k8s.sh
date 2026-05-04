#!/bin/bash

set -euo pipefail

# Ensure the required namespace exists before creating namespaced resources.
ensure_namespace() {
  local namespace="$1"

  if ! kubectl get namespace "$namespace" >/dev/null 2>&1; then
    kubectl create namespace "$namespace" >/dev/null
    echo "Created namespace: $namespace"
  else
    echo "Namespace already exists: $namespace"
  fi
}

# Ensure the deployment exists in the target namespace with the expected image.
ensure_deployment() {
  local namespace="$1"
  local deployment="$2"
  local image="$3"

  if ! kubectl get deployment "$deployment" -n "$namespace" >/dev/null 2>&1; then
    kubectl create deployment "$deployment" --image="$image" -n "$namespace" >/dev/null
    echo "Created deployment: $deployment in namespace: $namespace"
  else
    echo "Deployment already exists: $deployment in namespace: $namespace"
  fi
}

# Reconcile the deployment to the desired replica count on every run.
ensure_replicas() {
  local namespace="$1"
  local deployment="$2"
  local replicas="$3"

  kubectl scale deployment "$deployment" --replicas="$replicas" -n "$namespace" >/dev/null
  echo "Set replicas for $deployment in namespace $namespace to $replicas"
}

# Ensure the application namespaces exist.
ensure_namespace "dev"
ensure_namespace "staging"

# Ensure the sample deployments exist in the correct namespaces.
ensure_deployment "dev" "auth-service" "nginx"
ensure_deployment "staging" "payment-service" "nginx"

# Reconcile replica counts to the expected baseline state.
ensure_replicas "dev" "auth-service" 1
ensure_replicas "staging" "payment-service" 2

echo "Kubernetes setup complete"
