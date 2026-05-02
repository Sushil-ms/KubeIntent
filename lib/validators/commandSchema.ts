import { z } from "zod";

export const actionSchema = z.enum([
  "get_pods",
  "scale_deployment",
  "restart_deployment",
]);

export const namespaceSchema = z.enum(["dev", "staging"]);

export const commandSchema = z
  .object({
    action: actionSchema,
    namespace: namespaceSchema,
    target: z.string().optional(),
    replicas: z.number().optional(),
  })
  .strict()
  .superRefine((command, ctx) => {
    if (
      (command.action === "scale_deployment" ||
        command.action === "restart_deployment") &&
      (!command.target || command.target.trim().length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["target"],
        message: `${command.action} requires a non-empty target`,
      });
    }

    if (
      command.action === "scale_deployment" &&
      command.replicas === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["replicas"],
        message: "scale_deployment requires replicas",
      });
    }
  });
