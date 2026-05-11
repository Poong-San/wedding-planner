"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { CategoryType } from "@/types";
import type { LedgerEntry } from "@/hooks/use-ledger";

interface LedgerAddModalProps {
  onSave: (entry: Omit<LedgerEntry, "id">) => void;
  onClose: () => void;
}

export function LedgerAddModal({ onSave, onClose }: LedgerAddModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [categoryType, setCategoryType] = useState<string>("");
  const [memo, setMemo] = useState("");

  const handleSave = () => {
    if (!title.trim() || !amount) return;
    onSave({
      title: title.trim(),
      amount: Number(amount),
      date,
      categoryType: (categoryType as CategoryType) || null,
      memo,
    });
    onClose();
  };

  return (
    <ModalShell title="지출 추가" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="지출 내역">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 웨딩홀 계약금"
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
        <Field label="날짜">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
          />
        </Field>
        <Field label="카테고리">
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans bg-white"
          >
            <option value="">기타</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="메모">
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="선택 사항"
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
