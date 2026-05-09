import { PatchStrategy, setHeaderOptions } from "@kubernetes/client-node";

import { k8sAppsV1 } from "@/lib/k8s/client";

export async function scaleDeployment(
  namespace: string,
  name: string,
  replicas: number,
): Promise<void> {
  try {
    await k8sAppsV1.patchNamespacedDeployment({
        namespace,
        name,
        body: {
          spec: {
            replicas,
          },
        },
      },
      setHeaderOptions("Content-Type", PatchStrategy.StrategicMergePatch),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to scale deployment";

    throw new Error(
      `Unable to scale deployment "${name}" in namespace "${namespace}": ${message}`,
    );
  }
}
