"use client";

import { CATEGORY_LABELS } from "@/lib/constants";
import { QUICK_LEDGER_CATEGORIES } from "@/lib/ledger-categories";

interface LedgerCategoryPickerProps {
  selectedCategory: string;
  customCategory: string;
  showMoreCategories: boolean;
  onCategoryChange: (category: string) => void;
  onCustomCategoryChange: (category: string) => void;
  onToggleMore: () => void;
}

export function LedgerCategoryPicker({
  selectedCategory,
  customCategory,
  showMoreCategories,
  onCategoryChange,
  onCustomCategoryChange,
  onToggleMore,
}: LedgerCategoryPickerProps) {
  return (
    <div>
      <div className="text-[11px] text-ink-500 font-medium mb-2">카테고리</div>
      <div className="grid grid-cols-4 gap-1.5">
        {QUICK_LEDGER_CATEGORIES.map((category) => (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`py-2 rounded-lg border cursor-pointer font-sans text-[11px] ${
              selectedCategory === category.key ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-ink-200 text-ink-600"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-1.5">
        <button
          onClick={onToggleMore}
          className="py-2 border border-dashed border-ink-300 rounded-lg text-[11px] text-ink-500 cursor-pointer bg-white font-sans"
        >
          + 결혼 카테고리
        </button>
        <button
          onClick={() => onCategoryChange("custom")}
          className={`py-2 border rounded-lg text-[11px] cursor-pointer font-sans ${
            selectedCategory === "custom" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-dashed border-ink-300 text-ink-500"
          }`}
        >
          직접 입력
        </button>
      </div>
      {showMoreCategories && (
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onCategoryChange(label)}
              className={`py-2 rounded-lg text-[11px] border cursor-pointer font-sans ${
                selectedCategory === label ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-ink-200 text-ink-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {selectedCategory === "custom" && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2.5 border border-ink-200 rounded-lg">
          <span className="text-[11px] text-ink-400 w-12">기타</span>
          <input
            value={customCategory}
            onChange={(event) => onCustomCategoryChange(event.target.value)}
            placeholder="카테고리 직접 입력"
            className="flex-1 text-[13px] outline-none bg-transparent font-sans"
          />
        </div>
      )}
    </div>
  );
}
