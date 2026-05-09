import { env } from "@/lib/config/env";
import { COMMAND_PARSE_PROMPT } from "@/lib/llm/prompts";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-4.1-mini";

const responseFormat = {
  type: "json_schema",
  name: "parsed_command",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      action: {
        type: "string",
        enum: [
          "get_pods",
          "scale_deployment",
          "restart_deployment",
          "unsupported",
        ],
      },
      namespace: {
        type: ["string", "null"],
        enum: ["dev", "staging", null],
      },
      target: {
        type: ["string", "null"],
      },
      replicas: {
        type: ["number", "null"],
      },
    },
    required: ["action", "namespace", "target", "replicas"],
  },
} as const;

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

export async function parseCommandWithLLM(command: string): Promise<unknown> {
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      store: false,
      instructions: COMMAND_PARSE_PROMPT,
      input: command,
      text: {
        format: responseFormat,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const result = (await response.json()) as OpenAIResponse;

  const outputText =
    result.output_text ??
    result.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === "output_text")
      ?.text;

  if (!outputText) {
    throw new Error("OpenAI response did not include output_text");
  }

  const parsed = JSON.parse(outputText) as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== null),
  ) as unknown;
}
