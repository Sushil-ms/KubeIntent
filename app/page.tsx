"use client";

import { useState } from "react";

import { ApprovalCard } from "@/components/ApprovalCard";
import { CommandInput } from "@/components/CommandInput";
import { ResultPanel } from "@/components/ResultPanel";
import type { ParsedCommand, ValidationResult } from "@/types/command";

type ApprovalStatus = "idle" | "approved" | "cancelled";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedCommand, setParsedCommand] = useState<ParsedCommand | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("idle");

  async function handleCommandSubmit(command: string): Promise<void> {
    setIsLoading(true);
    setErrors([]);
    setParsedCommand(null);
    setApprovalStatus("idle");

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

  function handleApprovalConfirm(): void {
    setApprovalStatus("approved");
  }

  function handleApprovalCancel(): void {
    setApprovalStatus("cancelled");
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
                isApproved={approvalStatus === "approved"}
                onCancel={handleApprovalCancel}
                onConfirm={handleApprovalConfirm}
              />

              {approvalStatus === "approved" ? (
                <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  Action approved. Execution will be added in a later step.
                </p>
              ) : null}

              {approvalStatus === "cancelled" ? (
                <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  Action cancelled.
                </p>
              ) : null}
            </div>
          ) : null}

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
