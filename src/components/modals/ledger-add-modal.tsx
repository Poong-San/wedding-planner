"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { getOwnerDisplayLabels } from "@/lib/couple-labels";
import { LedgerCategoryPicker } from "@/components/ledger/ledger-category-picker";
import { resolveLedgerCategory } from "@/lib/ledger-categories";
import { useCouple } from "@/hooks/use-couple";
import type { LedgerEntry, LedgerOwner, LedgerType } from "@/hooks/use-ledger";

interface LedgerAddModalProps {
  onSave: (entry: Omit<LedgerEntry, "id">) => void;
  onClose: () => void;
  defaultType?: LedgerType;
}

export function LedgerAddModal({ onSave, onClose, defaultType = "expense" }: LedgerAddModalProps) {
  const { couple } = useCouple();
  const today = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState<LedgerType>(defaultType);
  const [amount, setAmount] = useState("");
  const [owner, setOwner] = useState<LedgerOwner>("shared");
  const [categoryType, setCategoryType] = useState<string>("");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [memo, setMemo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const ownerLabels = getOwnerDisplayLabels(couple);

  const handleSave = () => {
    if (!amount || !title.trim()) return;
    onSave({
      title: title.trim(),
      amount: Number(amount),
      date,
      categoryType: resolveLedgerCategory(categoryType, customCategory),
      memo,
      owner,
      type,
      paymentMethod,
      isRecurring: false,
      recurringDay: null,
      isPlanned: false,
    });
    onClose();
  };

  return (
    <ModalShell title="거래 추가" onClose={onClose}>
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

        <button className="btn-primary mt-2" onClick={handleSave}>
          저장
        </button>
      </div>
    </ModalShell>
  );
}
