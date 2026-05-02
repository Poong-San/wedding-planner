"use client";

import { CheckIcon } from "@/components/ui/icons";
import { formatManWon } from "@/lib/utils";
import type { Payment } from "@/types";

interface PaymentTimelineProps {
  payments: Payment[];
  onToggle?: (index: number) => void;
}

export function PaymentTimeline({ payments, onToggle }: PaymentTimelineProps) {
  if (!payments || payments.length === 0) return null;

  return (
    <div className="px-5 pb-4">
      <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-2.5">
        납부 일정
      </div>
      <div className="card p-0">
        {payments.map((p, i) => (
          <div
            key={i}
            onClick={() => onToggle?.(i)}
            className={`px-3.5 py-3 flex items-center gap-2.5 cursor-pointer ${
              i < payments.length - 1 ? "border-b border-ink-100" : ""
            }`}
          >
            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${
              p.done ? "bg-green-500" : "border-[1.5px] border-ink-300"
            }`}>
              {p.done && <CheckIcon width={11} height={11} className="text-white" />}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{p.label}</div>
              <div className="text-[11px] text-ink-500">{p.date}</div>
            </div>
            <div className={`text-[13px] font-semibold ${
              p.done ? "text-ink-400 line-through" : "text-green-700"
            }`}>
              {formatManWon(p.amount)}만원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
