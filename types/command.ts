export type ActionType =
  | "get_pods"
  | "scale_deployment"
  | "restart_deployment";

export type ParsedCommand = {
  action: ActionType;
  namespace: "dev" | "staging";
  target?: string;
  replicas?: number;
};

export type ValidationResult =
  | {
      ok: true;
      command: ParsedCommand;
    }
  | {
      ok: false;
      errors: string[];
    };
