"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import { LedgerCategoryPicker } from "@/components/ledger/ledger-category-picker";
import { getOwnerShortLabels } from "@/lib/couple-labels";
import { resolveLedgerCategory } from "@/lib/ledger-categories";
import { useCouple } from "@/hooks/use-couple";
import type { LedgerEntry, LedgerOwner } from "@/hooks/use-ledger";

interface Props {
  onSave: (entry: Omit<LedgerEntry, "id">) => void | Promise<boolean>;
  onClose: () => void;
}

export function LedgerPlannedModal({ onSave, onClose }: Props) {
  const { couple } = useCouple();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
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
    if (!date) {
      setError("예정 날짜를 선택해 주세요.");
      return;
    }
    const category = resolveLedgerCategory(categoryType, customCategory);
    setSaving(true);
    const result = await onSave({
      title: title.trim() || category || "예정 지출",
      amount: Number(amount),
      date,
      categoryType: category,
      memo,
      owner,
      type: "expense",
      isRecurring: false,
      recurringDay: null,
      paymentMethod: "",
      isPlanned: true,
    });
    setSaving(false);
    if (result === false) {
      setError("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    onClose();
  };

  return (
    <ModalShell title="예정 지출 추가" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="항목">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 본식 잔금, 드레스 잔금"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" autoFocus />
        </Field>
        <Field label="예정 금액 (원)">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="예정 날짜">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
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
