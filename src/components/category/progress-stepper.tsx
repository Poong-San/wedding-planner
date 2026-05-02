import { STATUS_STEP_INDEX, STEP_LABELS } from "@/lib/constants";
import type { CategoryStatus } from "@/types";

interface ProgressStepperProps {
  status: CategoryStatus;
}

export function ProgressStepper({ status }: ProgressStepperProps) {
  const currentStep = STATUS_STEP_INDEX[status] ?? 0;

  return (
    <div className="px-5 py-[18px]">
      <div className="flex items-center justify-between relative">
        {STEP_LABELS.map((label, i) => {
          const active = i <= currentStep;
          return (
            <div key={i} className="flex flex-col items-center z-[1] flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                active
                  ? "bg-green-500 text-white"
                  : "bg-white border-[1.5px] border-ink-300 text-ink-400"
              }`}>
                {i + 1}
              </div>
              <div className={`text-[10px] mt-1.5 ${
                active ? "text-green-700 font-semibold" : "text-ink-400"
              }`}>
                {label}
              </div>
            </div>
          );
        })}
        <div className="absolute top-[11px] left-5 right-5 h-0.5 bg-ink-200" />
        <div
          className="absolute top-[11px] left-5 h-0.5 bg-green-500"
          style={{ width: `${(currentStep / (STEP_LABELS.length - 1)) * 80}%` }}
        />
      </div>
    </div>
  );
}
