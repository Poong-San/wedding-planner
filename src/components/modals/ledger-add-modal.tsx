"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { getOwnerDisplayLabels } from "@/lib/couple-labels";
import { LedgerCategoryPicker } from "@/components/ledger/ledger-category-picker";
import { getLedgerCategorySelection, resolveLedgerCategory } from "@/lib/ledger-categories";
import { useCouple } from "@/hooks/use-couple";
import type { LedgerEntry, LedgerOwner, LedgerType } from "@/hooks/use-ledger";

interface LedgerAddModalProps {
  onSave: (entry: Omit<LedgerEntry, "id">) => void | Promise<boolean>;
  onClose: () => void;
  defaultType?: LedgerType;
  entry?: LedgerEntry;
  onDelete?: (id: string) => void | Promise<void>;
}

export function LedgerAddModal({ onSave, onClose, defaultType = "expense", entry, onDelete }: LedgerAddModalProps) {
  const { couple } = useCouple();
  const today = new Date().toISOString().slice(0, 10);
  const initialCategory = getLedgerCategorySelection(entry?.categoryType || null);
  const [type, setType] = useState<LedgerType>(entry?.type || defaultType);
  const [amount, setAmount] = useState(entry ? String(entry.amount) : "");
  const [owner, setOwner] = useState<LedgerOwner>(entry?.owner || "shared");
  const [categoryType, setCategoryType] = useState<string>(initialCategory.selectedCategory);
  const [customCategory, setCustomCategory] = useState(initialCategory.customCategory);
  const [title, setTitle] = useState(entry?.title || "");
  const [date, setDate] = useState(entry?.date || today);
  const [memo, setMemo] = useState(entry?.memo || "");
  const [paymentMethod, setPaymentMethod] = useState(entry?.paymentMethod || "");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const ownerLabels = getOwnerDisplayLabels(couple);

  const handleSave = async () => {
    setError("");
    if (!amount || Number(amount) <= 0) {
      setError("금액을 입력해 주세요.");
      return;
    }
    const category = resolveLedgerCategory(categoryType, customCategory);
    const fallbackTitle = type === "income" ? "수입" : type === "transfer" ? "이체" : "지출";
    setSaving(true);
    const result = await onSave({
      title: title.trim() || category || fallbackTitle,
      amount: Number(amount),
      date,
      categoryType: category,
      memo,
      owner,
      type,
      paymentMethod,
      isRecurring: entry?.isRecurring || false,
      recurringDay: entry?.recurringDay || null,
      isPlanned: entry?.isPlanned || false,
    });
    setSaving(false);
    if (result === false) {
      setError("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!entry || !onDelete) return;
    if (!confirm("이 거래를 삭제할까요?")) return;
    await onDelete(entry.id);
    onClose();
  };

  return (
    <ModalShell title={entry ? "거래 수정" : "거래 추가"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* 타입 토글 */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-ink-100 rounded-lg">
          {(["income", "expense", "transfer"] as LedgerType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`py-2 text-[13px] font-medium rounded-md cursor-pointer border-none font-sans ${
                type === t ? "bg-white shadow-sm text-ink-900" : "bg-transparent text-ink-500"
              }`}
            >
              {t === "income" ? "수입" : t === "expense" ? "지출" : "이체"}
            </button>
          ))}
        </div>

        {/* 큰 금액 입력 */}
        <div className="text-center py-3 border-b border-ink-200">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full font-serif text-4xl font-bold text-center border-none outline-none bg-transparent text-ink-900 font-sans"
            style={{ fontFamily: "var(--font-fraunces), sans-serif" }}
            autoFocus
          />
          <div className="text-[11px] text-ink-400 mt-1">원</div>
        </div>

        {/* 누가 썼나요 */}
        <div>
          <div className="text-[11px] text-ink-500 font-medium mb-2">누가 썼나요</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(["groom", "bride", "shared"] as LedgerOwner[]).map((o) => {
              const colors = {
                groom: { active: "bg-blue-500 text-white border-blue-500", idle: "bg-white text-ink-600 border-ink-200" },
                bride: { active: "bg-rose-500 text-white border-rose-500", idle: "bg-white text-ink-600 border-ink-200" },
                shared: { active: "bg-green-500 text-white border-green-500", idle: "bg-white text-ink-600 border-ink-200" },
              };
              return (
                <button
                  key={o}
                  onClick={() => setOwner(o)}
                  className={`py-2 rounded-lg text-[12px] font-medium border cursor-pointer font-sans ${
                    owner === o ? colors[o].active : colors[o].idle
                  }`}
                >
                  • {ownerLabels[o]}
                </button>
              );
            })}
          </div>
        </div>

        <LedgerCategoryPicker
          selectedCategory={categoryType}
          customCategory={customCategory}
          showMoreCategories={showMoreCategories}
          onCategoryChange={setCategoryType}
          onCustomCategoryChange={setCustomCategory}
          onToggleMore={() => setShowMoreCategories(!showMoreCategories)}
        />

        {/* 상세 정보 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-ink-200 rounded-lg">
            <span className="text-[11px] text-ink-400 w-12">내역</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 스타벅스 양재점"
              className="flex-1 text-[13px] outline-none bg-transparent font-sans"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-ink-200 rounded-lg">
            <span className="text-[11px] text-ink-400 w-12">날짜</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 text-[13px] outline-none bg-transparent font-sans"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-ink-200 rounded-lg">
            <span className="text-[11px] text-ink-400 w-12">결제</span>
            <input
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="KB국민카드 / 현금 등"
              className="flex-1 text-[13px] outline-none bg-transparent font-sans"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 border border-ink-200 rounded-lg">
            <span className="text-[11px] text-ink-400 w-12">메모</span>
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="선택 사항"
              className="flex-1 text-[13px] outline-none bg-transparent font-sans"
            />
          </div>
        </div>

        {error && <div className="text-[12px] text-red-500 text-center">{error}</div>}

        <div className="flex gap-2 mt-2">
          {entry && onDelete && (
            <button className="btn-ghost flex-1 text-red-500" onClick={handleDelete} disabled={saving}>
              삭제
            </button>
          )}
          <button className="btn-primary flex-1 disabled:opacity-60" onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
