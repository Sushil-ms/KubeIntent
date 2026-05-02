import type { ParsedCommand } from "@/types/command";

type ResultPanelProps = {
  isLoading: boolean;
  parsedCommand: ParsedCommand | null;
  errors: string[];
};

export function ResultPanel({
  isLoading,
  parsedCommand,
  errors,
}: ResultPanelProps) {
  if (isLoading) {
    return (
      <section
        aria-label="Result"
        className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm"
      >
        Parsing command...
      </section>
    );
  }

  if (errors.length > 0) {
    return (
      <section
        aria-label="Result"
        className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm"
      >
        <p className="font-medium text-red-900">Unable to parse command</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (parsedCommand) {
    return (
      <section
        aria-label="Result"
        className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-sm"
      >
        <p className="font-medium">Validated parsed command</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-white/80 p-4 text-xs text-slate-800">
          {JSON.stringify(parsedCommand, null, 2)}
        </pre>
      </section>
    );
  }

  return (
    <section
      aria-label="Result"
      className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm"
    >
      Submit a Kubernetes command to see the validated parsed result.
    </section>
  );
}
