import { NextResponse } from "next/server";

import { env } from "@/lib/config/env";
import { parseCommandWithLLM } from "@/lib/llm/parseCommandWithLLM";
import { mockParseCommand } from "@/lib/parser/mockParser";
import { normalizeParsedCommand } from "@/lib/parser/normalizeParsedCommand";
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

  let parsedCommand: unknown;

  if (env.OPENAI_API_KEY) {
    try {
      parsedCommand = await parseCommandWithLLM(command);
    } catch {
      parsedCommand = mockParseCommand(command);
    }
  } else {
    parsedCommand = mockParseCommand(command);
  }

  parsedCommand = normalizeParsedCommand(parsedCommand);

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

  if (
    !validationResult.ok &&
    typeof parsedCommand === "object" &&
    parsedCommand !== null &&
    "action" in parsedCommand &&
    parsedCommand.action === "unsupported"
  ) {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Unsupported command"],
      },
      { status: 400 },
    );
  }

  const status = validationResult.ok ? 200 : 400;

  return NextResponse.json(validationResult, { status });
}
