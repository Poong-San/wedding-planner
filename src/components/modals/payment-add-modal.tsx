"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";

interface PaymentAddModalProps {
  onSave: (payment: { label: string; amount: number; date: string }) => void;
  onClose: () => void;
}

export function PaymentAddModal({ onSave, onClose }: PaymentAddModalProps) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({ label, amount: Number(amount) || 0, date });
    onClose();
  };

  return (
    <ModalShell title="납부 일정 추가" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="항목명">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="예: 계약금, 잔금"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            autoFocus
          />
        </Field>
        <Field label="금액 (원)">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
          />
        </Field>
        <Field label="납부 예정일">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
          />
        </Field>
        <button className="btn-primary mt-1.5" onClick={handleSave}>
          추가
        </button>
      </div>
    </ModalShell>
  );
}
