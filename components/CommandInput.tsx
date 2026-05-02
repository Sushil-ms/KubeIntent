"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type CommandInputProps = {
  isLoading: boolean;
  onSubmit: (command: string) => Promise<void>;
};

export function CommandInput({ isLoading, onSubmit }: CommandInputProps) {
  const [command, setCommand] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedCommand = command.trim();

    if (!trimmedCommand || isLoading) {
      return;
    }

    await onSubmit(trimmedCommand);
    setCommand("");
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        aria-label="Kubernetes command"
        className="min-h-12 flex-1 rounded-lg border border-slate-300 px-4 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        disabled={isLoading}
        onChange={(event) => setCommand(event.target.value)}
        placeholder="e.g. scale payment-service to 5 replicas in staging"
        type="text"
        value={command}
      />
      <button
        className="min-h-12 rounded-lg bg-slate-950 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Parsing..." : "Submit"}
      </button>
    </form>
  );
}
