const namespacePattern = "([a-z0-9-]+)";
const showOrGetPodsPattern = new RegExp(
  `^(?:show|get)\\s+pods\\s+in\\s+${namespacePattern}$`,
  "i",
);
const scalePattern =
  new RegExp(
    `^scale\\s+([a-z0-9-]+)\\s+to\\s+(\\d+)\\s+replicas\\s+in\\s+${namespacePattern}$`,
    "i",
  );
const restartPattern = new RegExp(
  `^restart\\s+([a-z0-9-]+)\\s+in\\s+${namespacePattern}$`,
  "i",
);

export function mockParseCommand(command: string): unknown {
  const normalizedCommand = command.trim();

  const showOrGetMatch = normalizedCommand.match(showOrGetPodsPattern);

  if (showOrGetMatch) {
    const [, namespace] = showOrGetMatch;

    return {
      action: "get_pods",
      namespace: namespace.toLowerCase(),
    };
  }

  const scaleMatch = normalizedCommand.match(scalePattern);

  if (scaleMatch) {
    const [, target, replicas, namespace] = scaleMatch;

    return {
      action: "scale_deployment",
      namespace: namespace.toLowerCase(),
      target,
      replicas: Number(replicas),
    };
  }

  const restartMatch = normalizedCommand.match(restartPattern);

  if (restartMatch) {
    const [, target, namespace] = restartMatch;

    return {
      action: "restart_deployment",
      namespace: namespace.toLowerCase(),
      target,
    };
  }

  return null;
}
