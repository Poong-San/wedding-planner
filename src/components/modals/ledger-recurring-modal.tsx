"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import { LedgerCategoryPicker } from "@/components/ledger/ledger-category-picker";
import { getOwnerShortLabels } from "@/lib/couple-labels";
import { resolveLedgerCategory } from "@/lib/ledger-categories";
import { useCouple } from "@/hooks/use-couple";
import type { LedgerEntry, LedgerOwner, LedgerType } from "@/hooks/use-ledger";

interface Props {
  onSave: (entry: Omit<LedgerEntry, "id">) => void | Promise<boolean>;
  onClose: () => void;
}

export function LedgerRecurringModal({ onSave, onClose }: Props) {
  const { couple } = useCouple();
  const [type, setType] = useState<LedgerType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [day, setDay] = useState("1");
  const [owner, setOwner] = useState<LedgerOwner>("shared");
  const [categoryType, setCategoryType] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const ownerLabels = getOwnerShortLabels(couple);

  const handleSave = async () => {
    setError("");
    if (!amount || Number(amount) <= 0) {
      setError("금액을 입력해 주세요.");
      return;
    }
    const recurringDay = Number(day);
    if (!recurringDay || recurringDay < 1 || recurringDay > 31) {
      setError("결제일은 1일부터 31일 사이로 입력해 주세요.");
      return;
    }
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const category = resolveLedgerCategory(categoryType, customCategory);
    setSaving(true);
    const result = await onSave({
      title: title.trim() || category || (type === "income" ? "고정 수입" : "고정 지출"),
      amount: Number(amount),
      date: dateStr,
      categoryType: category,
      memo,
      owner,
      type,
      isRecurring: true,
      recurringDay,
      paymentMethod: "",
      isPlanned: false,
    });
    setSaving(false);
    if (result === false) {
      setError("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
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
        <LedgerCategoryPicker
          selectedCategory={categoryType}
          customCategory={customCategory}
          showMoreCategories={showMoreCategories}
          onCategoryChange={setCategoryType}
          onCustomCategoryChange={setCustomCategory}
          onToggleMore={() => setShowMoreCategories(!showMoreCategories)}
        />
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
        {error && <div className="text-[12px] text-red-500 text-center">{error}</div>}
        <button className="btn-primary mt-1.5 disabled:opacity-60" onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </ModalShell>
  );
}
