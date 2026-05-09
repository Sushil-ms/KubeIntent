import { PatchStrategy, setHeaderOptions } from "@kubernetes/client-node";

import { k8sAppsV1 } from "@/lib/k8s/client";

export async function restartDeployment(
  namespace: string,
  name: string,
): Promise<void> {
  try {
    await k8sAppsV1.patchNamespacedDeployment({
        namespace,
        name,
        body: {
          spec: {
            template: {
              metadata: {
                annotations: {
                  "kubectl.kubernetes.io/restartedAt":
                    new Date().toISOString(),
                },
              },
            },
          },
        },
      },
      setHeaderOptions("Content-Type", PatchStrategy.StrategicMergePatch),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to restart deployment";

    throw new Error(
      `Unable to restart deployment "${name}" in namespace "${namespace}": ${message}`,
    );
  }
}
