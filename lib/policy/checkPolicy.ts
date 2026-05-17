import type { ParsedCommand } from "@/types/command";

type PolicyResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const allowedNamespaces = new Set<ParsedCommand["namespace"]>([
  "dev",
  "staging",
]);

const allowedActions = new Set<ParsedCommand["action"]>([
  "get_pods",
  "scale_deployment",
  "restart_deployment",
]);

const allowedTargets = new Set(["payment-service", "auth-service"]);

export function checkPolicy(command: ParsedCommand): PolicyResult {
  const errors: string[] = [];

  if (!allowedNamespaces.has(command.namespace)) {
    errors.push(`Namespace "${command.namespace}" is not allowed`);
  }

  if (!allowedActions.has(command.action)) {
    errors.push(`Action "${command.action}" is not allowed`);
  }

  if (
    (command.action === "scale_deployment" ||
      command.action === "restart_deployment") &&
    command.target &&
    !allowedTargets.has(command.target)
  ) {
    errors.push(`Deployment "${command.target}" is not allowed`);
  }

  if (
    command.action === "scale_deployment" &&
    typeof command.replicas === "number" &&
    command.replicas > 5
  ) {
    errors.push("Scaling above 5 replicas is not allowed");
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
