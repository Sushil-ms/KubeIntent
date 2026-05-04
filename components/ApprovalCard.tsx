import type { ParsedCommand } from "@/types/command";

type ApprovalCardProps = {
  command: ParsedCommand;
  onConfirm: () => void;
  onCancel: () => void;
  isApproved?: boolean;
};

function getCommandSummary(command: ParsedCommand): string {
  switch (command.action) {
    case "get_pods":
      return `Get pods in ${command.namespace}`;
    case "scale_deployment":
      return `Scale ${command.target} to ${command.replicas} replicas in ${command.namespace}`;
    case "restart_deployment":
      return `Restart ${command.target} in ${command.namespace}`;
    default:
      return "Review command";
  }
}

export function ApprovalCard({
  command,
  onConfirm,
  onCancel,
  isApproved = false,
}: ApprovalCardProps) {
  const summary = getCommandSummary(command);

  return (
    <section
      aria-label="Approval"
      className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-lg shadow-slate-950/20"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Approval Required
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              Review requested action
            </h2>
          </div>
          {isApproved ? (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Approved
            </span>
          ) : null}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-sm text-slate-300">Command summary</p>
          <p className="mt-2 text-base font-medium text-white">{summary}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="min-h-11 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isApproved}
            onClick={onConfirm}
            type="button"
          >
            {isApproved ? "Approved" : "Confirm"}
          </button>
          <button
            className="min-h-11 rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
