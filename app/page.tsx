"use client";

import { useState } from "react";

import { ApprovalCard } from "@/components/ApprovalCard";
import { CommandInput } from "@/components/CommandInput";
import { ResultPanel } from "@/components/ResultPanel";
import type { ParsedCommand, ValidationResult } from "@/types/command";

type PodInfo = {
  name: string;
  status: string;
  createdAt: string;
};

type ExecuteSuccessResult = {
  ok: true;
  data: PodInfo[];
};

type ExecuteErrorResult = {
  ok: false;
  errors: string[];
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedCommand, setParsedCommand] = useState<ParsedCommand | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<PodInfo[] | null>(null);
  const [executionErrors, setExecutionErrors] = useState<string[]>([]);

  async function handleCommandSubmit(command: string): Promise<void> {
    setIsLoading(true);
    setErrors([]);
    setParsedCommand(null);
    setExecutionLoading(false);
    setExecutionResult(null);
    setExecutionErrors([]);

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

  async function handleApprovalConfirm(): Promise<void> {
    if (!parsedCommand || executionLoading) {
      return;
    }

    setExecutionLoading(true);
    setExecutionErrors([]);
    setExecutionResult(null);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedCommand),
      });

      const result = (await response.json()) as
        | ExecuteSuccessResult
        | ExecuteErrorResult;

      if (result.ok) {
        setExecutionResult(result.data);
        return;
      }

      setExecutionErrors(result.errors);
    } catch {
      setExecutionErrors(["Unable to reach execute API"]);
    } finally {
      setExecutionLoading(false);
    }
  }

  function handleApprovalCancel(): void {
    setParsedCommand(null);
    setExecutionLoading(false);
    setExecutionResult(null);
    setExecutionErrors([]);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <section className="w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-black/30 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            KubeIntent
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Control Kubernetes using natural language
          </p>
        </div>

        <div className="space-y-6">
          <CommandInput isLoading={isLoading} onSubmit={handleCommandSubmit} />
          {parsedCommand ? (
            <div className="space-y-3">
              <ApprovalCard
                command={parsedCommand}
                onConfirm={handleApprovalConfirm}
                onCancel={handleApprovalCancel}
                isApproved={executionLoading || executionResult !== null}
              />
            </div>
          ) : null}
          <ResultPanel
            errors={errors}
            isLoading={isLoading}
            parsedCommand={parsedCommand}
            executionErrors={executionErrors}
            executionLoading={executionLoading}
            executionResult={executionResult}
          />
        </div>
      </section>
    </main>
  );
}
