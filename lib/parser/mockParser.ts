import type { ParsedCommand } from "@/types/command";

const showOrGetPodsPattern = /^(?:show|get)\s+pods\s+in\s+(dev|staging)$/i;
const scalePattern =
  /^scale\s+([a-z0-9-]+)\s+to\s+(\d+)\s+replicas\s+in\s+(dev|staging)$/i;
const restartPattern =
  /^restart\s+([a-z0-9-]+)\s+in\s+(dev|staging)$/i;
const validNamespaces = ["dev", "staging"] as const;

function isNamespace(value: string): value is ParsedCommand["namespace"] {
  return validNamespaces.includes(value as ParsedCommand["namespace"]);
}

export function mockParseCommand(command: string): unknown {
  const normalizedCommand = command.trim();

  const showOrGetMatch = normalizedCommand.match(showOrGetPodsPattern);

  if (showOrGetMatch && isNamespace(showOrGetMatch[1])) {
    const [, namespace] = showOrGetMatch;

    return {
      action: "get_pods",
      namespace,
    } satisfies ParsedCommand;
  }

  const scaleMatch = normalizedCommand.match(scalePattern);

  if (scaleMatch && isNamespace(scaleMatch[3])) {
    const [, target, replicas, namespace] = scaleMatch;

    return {
      action: "scale_deployment",
      namespace,
      target,
      replicas: Number(replicas),
    } satisfies ParsedCommand;
  }

  const restartMatch = normalizedCommand.match(restartPattern);

  if (restartMatch && isNamespace(restartMatch[2])) {
    const [, target, namespace] = restartMatch;

    return {
      action: "restart_deployment",
      namespace,
      target,
    } satisfies ParsedCommand;
  }

  return null;
}
