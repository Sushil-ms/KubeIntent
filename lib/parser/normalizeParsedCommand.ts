type ParsedCommandLike = {
  action?: unknown;
  namespace?: unknown;
  target?: unknown;
  replicas?: unknown;
};

const deploymentAliases: Record<string, string> = {
  auth: "auth-service",
  payment: "payment-service",
};

export function normalizeParsedCommand(input: unknown): unknown {
  if (!input || typeof input !== "object") {
    return input;
  }

  const command = input as ParsedCommandLike;

  if (typeof command.target !== "string") {
    return input;
  }

  const normalizedTarget = deploymentAliases[command.target] ?? command.target;

  if (normalizedTarget === command.target) {
    return input;
  }

  return {
    ...command,
    target: normalizedTarget,
  };
}
