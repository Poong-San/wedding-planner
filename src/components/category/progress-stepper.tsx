import { STATUS_STEP_INDEX, STEP_LABELS } from "@/lib/constants";
import type { CategoryStatus } from "@/types";

// 클릭 시 매핑: 스텝 인덱스 → 상태
const STEP_STATUS_MAP: CategoryStatus[] = [
  "consulting",   // 0: 상담
  "contracted",   // 1: 계약
  "in_progress",  // 2: 진행
  "payment",      // 3: 잔금
  "completed",    // 4: 완료
];

interface ProgressStepperProps {
  status: CategoryStatus;
  onStatusChange?: (status: CategoryStatus) => void;
}

export function ProgressStepper({ status, onStatusChange }: ProgressStepperProps) {
  // currentStep: -1(미정), 0(상담), 1(계약), 2(진행), 3(잔금), 4(완료)
  const currentStep = STATUS_STEP_INDEX[status] ?? -1;
  const totalSteps = STEP_LABELS.length;

  // 진행 라인 비율 계산
  const linePercent = currentStep <= 0 ? 0 : (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="px-5 py-[18px]">
      <div className="flex items-center justify-between relative">
        {/* 배경 라인 (전체) */}
        <div className="absolute top-[12px] left-[10%] right-[10%] h-0.5 bg-ink-200" />
        {/* 활성 라인 */}
        {linePercent > 0 && (
          <div
            className="absolute top-[12px] left-[10%] h-0.5 bg-green-500 transition-all duration-300"
            style={{ width: `${linePercent * 0.8}%` }}
          />
        )}

        {STEP_LABELS.map((label, i) => {
          const active = currentStep >= 0 && i <= currentStep;
          return (
            <div key={i} className="flex flex-col items-center z-[1] flex-1">
              <button
                type="button"
                onClick={() => onStatusChange?.(STEP_STATUS_MAP[i])}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold cursor-pointer transition-all duration-150 hover:scale-110 ${
                  active
                    ? "bg-green-500 text-white border-2 border-green-500 hover:bg-green-600"
                    : "bg-white border-2 border-ink-300 text-ink-400 hover:bg-ink-100"
                }`}
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
      </div>
    </div>
  );
}
