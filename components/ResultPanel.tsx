import type { ParsedCommand } from "@/types/command";

type PodInfo = {
  name: string;
  status: string;
  createdAt: string;
};

type ResultPanelProps = {
  isLoading: boolean;
  parsedCommand: ParsedCommand | null;
  errors: string[];
  executionLoading: boolean;
  executionResult: PodInfo[] | null;
  executionErrors: string[];
};

export function ResultPanel({
  isLoading,
  parsedCommand,
  errors,
  executionLoading,
  executionResult,
  executionErrors,
}: ResultPanelProps) {
  if (isLoading) {
    return (
      <section
        aria-label="Result"
        className="rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-300 shadow-lg"
      >
        Parsing command...
      </section>
    );
  }

  if (executionLoading) {
    return (
      <section
        aria-label="Result"
        className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm text-blue-700 shadow-sm"
      >
        <p className="font-medium text-blue-900">Executing command</p>
        <p className="mt-2">Fetching live pod data from Kubernetes...</p>
      </section>
    );
  }

  if (executionErrors.length > 0) {
    return (
      <section
        aria-label="Result"
        className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm"
      >
        <p className="font-medium text-red-900">Execution failed</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {executionErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
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

  if (executionResult) {
    return (
      <section
        aria-label="Result"
        className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-sm"
      >
        <p className="font-medium">Pods in namespace</p>
        {executionResult.length === 0 ? (
          <p className="mt-3 text-emerald-800">No pods found.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-md bg-white/90">
            <table className="min-w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created At</th>
                </tr>
              </thead>
              <tbody>
                {executionResult.map((pod) => (
                  <tr
                    key={`${pod.name}-${pod.createdAt}`}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-3">{pod.name}</td>
                    <td className="px-4 py-3">{pod.status}</td>
                    <td className="px-4 py-3">{pod.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
      className="rounded-xl border border-gray-700 bg-gray-900 p-5 text-sm text-gray-300 shadow-lg"
    >
      Type a Kubernetes command to get started
    </section>
  );
}
