import { NextResponse } from "next/server";

import { getPods } from "@/lib/k8s/getPods";
import { restartDeployment } from "@/lib/k8s/restartDeployment";
import { scaleDeployment } from "@/lib/k8s/scaleDeployment";
import { checkPolicy } from "@/lib/policy/checkPolicy";
import type { ParsedCommand } from "@/types/command";

export async function POST(request: Request) {
  let command: ParsedCommand;

  try {
    command = (await request.json()) as ParsedCommand;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Invalid JSON body"],
      },
      { status: 400 },
    );
  }

  try {
    const policyResult = checkPolicy(command);

    if (!policyResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          errors: policyResult.errors,
        },
        { status: 403 },
      );
    }

    switch (command.action) {
      case "get_pods": {
        const pods = await getPods(command.namespace);

        return NextResponse.json({
          ok: true,
          data: pods,
        });
      }
      case "scale_deployment": {
        if (!command.target || typeof command.replicas !== "number") {
          return NextResponse.json(
            {
              ok: false,
              errors: ["scale_deployment requires target and replicas"],
            },
            { status: 400 },
          );
        }

        await scaleDeployment(
          command.namespace,
          command.target,
          command.replicas,
        );

        return NextResponse.json({
          ok: true,
          message: "Scaled successfully",
        });
      }
      case "restart_deployment": {
        if (!command.target) {
          return NextResponse.json(
            {
              ok: false,
              errors: ["restart_deployment requires target"],
            },
            { status: 400 },
          );
        }

        await restartDeployment(command.namespace, command.target);

        return NextResponse.json({
          ok: true,
          message: "Restarted successfully",
        });
      }
      default:
        return NextResponse.json(
          {
            ok: false,
            errors: ["Unsupported action"],
          },
          { status: 400 },
        );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Execution failed";

    return NextResponse.json(
      {
        ok: false,
        errors: [message],
      },
      { status: 500 },
    );
  }
}
