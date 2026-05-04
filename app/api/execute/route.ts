import { NextResponse } from "next/server";

import { getPods } from "@/lib/k8s/getPods";
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

  if (command.action !== "get_pods") {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Unsupported action"],
      },
      { status: 400 },
    );
  }

  try {
    const pods = await getPods(command.namespace);

    return NextResponse.json({
      ok: true,
      data: pods,
    });
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
