"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import { getOwnerShortLabels } from "@/lib/couple-labels";
import { useCouple } from "@/hooks/use-couple";
import type { LedgerEntry, LedgerOwner, LedgerType } from "@/hooks/use-ledger";

interface Props {
  onSave: (entry: Omit<LedgerEntry, "id">) => void;
  onClose: () => void;
}

export function LedgerRecurringModal({ onSave, onClose }: Props) {
  const { couple } = useCouple();
  const [type, setType] = useState<LedgerType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [day, setDay] = useState("1");
  const [owner, setOwner] = useState<LedgerOwner>("shared");
  const [memo, setMemo] = useState("");
  const ownerLabels = getOwnerShortLabels(couple);

  const handleSave = () => {
    if (!title.trim() || !amount) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onSave({
      title: title.trim(),
      amount: Number(amount),
      date: dateStr,
      categoryType: null,
      memo,
      owner,
      type,
      isRecurring: true,
      recurringDay: Number(day),
      paymentMethod: "",
      isPlanned: false,
    });
    onClose();
  };

  return (
    <ModalShell title="고정 항목 추가" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-1 p-1 bg-ink-100 rounded-lg">
          {(["income", "expense"] as LedgerType[]).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`py-2 text-[13px] font-medium rounded-md cursor-pointer border-none font-sans ${
                type === t ? "bg-white shadow-sm" : "bg-transparent text-ink-500"
              }`}>
              {t === "income" ? "수입" : "지출"}
            </button>
          ))}
        </div>
        <Field label="항목명">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 월세, 월급"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" autoFocus />
        </Field>
        <Field label="금액 (원)">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="매월 결제일">
          <input type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="소유">
          <div className="grid grid-cols-3 gap-1.5">
            {(["groom", "bride", "shared"] as LedgerOwner[]).map((o) => {
              const colors = {
                groom: "bg-blue-500 text-white border-blue-500",
                bride: "bg-rose-500 text-white border-rose-500",
                shared: "bg-green-500 text-white border-green-500",
              };
              return (
                <button key={o} onClick={() => setOwner(o)}
                  className={`py-2 rounded-lg text-[12px] font-medium border cursor-pointer font-sans ${
                    owner === o ? colors[o] : "bg-white text-ink-600 border-ink-200"
                  }`}>
                  {ownerLabels[o]}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="메모">
          <input value={memo} onChange={(e) => setMemo(e.target.value)}
            placeholder="선택 사항"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <button className="btn-primary mt-1.5" onClick={handleSave}>저장</button>
      </div>
    </ModalShell>
  );
}
