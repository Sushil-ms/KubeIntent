import { NextResponse } from "next/server";

import { mockParseCommand } from "@/lib/parser/mockParser";
import { validateCommand } from "@/lib/validators/validateCommand";

type ParseRequestBody = {
  command?: unknown;
};

export async function POST(request: Request) {
  let body: ParseRequestBody;

  try {
    body = (await request.json()) as ParseRequestBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Invalid JSON body"],
      },
      { status: 400 },
    );
  }

  const command =
    typeof body.command === "string" ? body.command.trim() : undefined;

  if (!command) {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Command is required"],
      },
      { status: 400 },
    );
  }

  const parsedCommand = mockParseCommand(command);

  if (!parsedCommand) {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Unsupported command"],
      },
      { status: 400 },
    );
  }

  const validationResult = validateCommand(parsedCommand);
  const status = validationResult.ok ? 200 : 400;

  return NextResponse.json(validationResult, { status });
}
