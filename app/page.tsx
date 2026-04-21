import { ApprovalCard } from "@/components/ApprovalCard";
import { CommandInput } from "@/components/CommandInput";
import { ResultPanel } from "@/components/ResultPanel";

export default function HomePage() {
  return (
    <main>
      <h1>KubeIntent</h1>
      <CommandInput />
      <ApprovalCard />
      <ResultPanel />
    </main>
  );
}
