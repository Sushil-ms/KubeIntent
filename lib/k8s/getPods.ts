import { k8sCoreV1 } from "@/lib/k8s/client";

export type PodInfo = {
  name: string;
  status: string;
  createdAt: string;
};

export async function getPods(namespace: string): Promise<PodInfo[]> {
  try {
    const response = await k8sCoreV1.listNamespacedPod({ namespace });
    const podList = response.items ?? [];

    return podList.flatMap((pod) => {
      const name = pod.metadata?.name;
      const status = pod.status?.phase;
      const createdAt = pod.metadata?.creationTimestamp;

      if (!name || !status || !createdAt) {
        return [];
      }

      return [
        {
          name,
          status,
          createdAt: new Date(createdAt).toISOString(),
        },
      ];
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch pods";

    throw new Error(`Unable to list pods in namespace "${namespace}": ${message}`);
  }
}
