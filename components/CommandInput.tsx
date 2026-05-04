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
    <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
      <input
        aria-label="Kubernetes command"
        className="min-h-13 flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-base text-white shadow-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
        onChange={(event) => setCommand(event.target.value)}
        placeholder="e.g. scale payment-service to 5 replicas in staging"
        type="text"
        value={command}
      />
      <button
        className="min-h-13 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:text-blue-100"
        disabled={isLoading}
        type="submit"
      >
        <span className={isLoading ? "animate-pulse" : ""}>
          {isLoading ? "Parsing..." : "Submit"}
        </span>
      </button>
    </form>
  );
}
