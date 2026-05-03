import { STATUS_STEP_INDEX, STEP_LABELS } from "@/lib/constants";
import type { CategoryStatus } from "@/types";

const STEP_STATUS_MAP: CategoryStatus[] = [
  "consulting",
  "contracted",
  "in_progress",
  "in_progress",
  "completed",
];

interface ProgressStepperProps {
  status: CategoryStatus;
  onStatusChange?: (status: CategoryStatus) => void;
}

export function ProgressStepper({ status, onStatusChange }: ProgressStepperProps) {
  const currentStep = STATUS_STEP_INDEX[status] ?? 0;

  return (
    <div className="px-5 py-[18px]">
      <div className="flex items-center justify-between relative">
        {STEP_LABELS.map((label, i) => {
          const active = i <= currentStep;
          return (
            <div key={i} className="flex flex-col items-center z-[1] flex-1">
              <button
                type="button"
                onClick={() => onStatusChange?.(STEP_STATUS_MAP[i])}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-none cursor-pointer transition-transform duration-150 hover:scale-110 ${
                  active
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-white border-[1.5px] !border-ink-300 text-ink-400 hover:bg-ink-100"
                }`}
                style={!active ? { border: "1.5px solid" } : undefined}
              >
                {i + 1}
              </button>
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
