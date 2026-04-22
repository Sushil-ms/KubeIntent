# AGENTS.md

## Project
**KubeIntent – Natural Language Kubernetes Controller**

---

## Goal

Build an MVP where users type commands like:

- "Scale payment service to 5 replicas in staging"
- "Restart auth deployment"
- "Show pods in dev namespace"

System flow:

1. Parse → JSON (LLM)
2. Validate (Zod)
3. Apply safety rules
4. Require approval
5. Execute via Kubernetes
6. Return result in UI

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Node.js
- @kubernetes/client-node
- Zod
- LLM (OpenAI / Claude)
- Docker

---

## Architecture (STRICT)

1. **LLM Layer** → parse text → JSON
2. **Validation Layer** → schema check
3. **Safety Layer** → enforce rules
4. **Execution Layer** → Kubernetes calls
5. **UI Layer** → input → approval → result

Do NOT merge layers.

---

## Allowed Actions (MVP ONLY)

- get_pods
- scale_deployment
- restart_deployment

❌ Do NOT add delete / exec / secrets / YAML / admin ops

---

## Safety Rules (MANDATORY)

- Namespaces: `dev`, `staging` only
- Replicas: `1–10` only
- Reject missing/ambiguous commands
- ALWAYS require approval before execution

---

## Command Type

```ts
type ActionType =
  | "get_pods"
  | "scale_deployment"
  | "restart_deployment";

type ParsedCommand = {
  action: ActionType;
  namespace: "dev" | "staging";
  target?: string;
  replicas?: number;
};
```
