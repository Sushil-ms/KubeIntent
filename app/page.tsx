"use client";

import { CommandInput } from "@/components/CommandInput";
import { ResultPanel } from "@/components/ResultPanel";

export default function HomePage() {
  function handleCommandSubmit(command: string): void {
    void command;
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
          <CommandInput onSubmit={handleCommandSubmit} />
          <ResultPanel />
        </div>
      </section>
    </main>
  );
}
