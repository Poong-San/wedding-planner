import { ProgressBar } from "@/components/ui/progress-bar";

interface ProgressCardProps {
  done: number;
  total: number;
}

export function ChecklistProgressCard({ done, total }: ProgressCardProps) {
  return (
    <div className="px-5 pb-4">
      <div className="card-soft">
        <div className="flex justify-between mb-2">
          <span className="text-[13px] font-semibold">전체 진행률</span>
          <span className="text-[13px] font-bold text-green-700">{done} / {total}</span>
        </div>
        <ProgressBar percent={(done / total) * 100} />
      </div>
    </div>
  );
}
