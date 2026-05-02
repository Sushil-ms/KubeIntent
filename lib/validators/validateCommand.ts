import { commandSchema } from "@/lib/validators/commandSchema";
import type { ValidationResult } from "@/types/command";

export function validateCommand(input: unknown): ValidationResult {
  const result = commandSchema.safeParse(input);

  if (result.success) {
    return {
      ok: true,
      command: result.data,
    };
  }

  return {
    ok: false,
    errors: result.error.issues.map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    }),
  };
}
