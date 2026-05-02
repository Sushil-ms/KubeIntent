"use client";

import { useState } from "react";

import { CommandInput } from "@/components/CommandInput";
import { ResultPanel } from "@/components/ResultPanel";
import type { ParsedCommand, ValidationResult } from "@/types/command";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedCommand, setParsedCommand] = useState<ParsedCommand | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleCommandSubmit(command: string): Promise<void> {
    setIsLoading(true);
    setErrors([]);
    setParsedCommand(null);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      const result = (await response.json()) as ValidationResult;

      if (result.ok) {
        setParsedCommand(result.command);
        return;
      }

      setErrors(result.errors);
    } catch {
      setErrors(["Unable to reach parse API"]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">KubeIntent</h1>
          <p className="mt-3 text-base text-slate-600">
            Control Kubernetes using natural language
          </p>
        </div>

        <div className="space-y-6">
          <CommandInput isLoading={isLoading} onSubmit={handleCommandSubmit} />
          <ResultPanel
            errors={errors}
            isLoading={isLoading}
            parsedCommand={parsedCommand}
          />
        </div>
      </section>
    </main>
  );
}
