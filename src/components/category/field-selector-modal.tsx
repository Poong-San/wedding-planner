"use client";

import { ModalShell } from "@/components/modals/modal-shell";
import { CheckIcon } from "@/components/ui/icons";
import type { CategoryType, FieldDefinition } from "@/types";
import { FIELD_DEFINITIONS } from "@/lib/field-definitions";

interface FieldSelectorModalProps {
  categoryType: CategoryType;
  existingKeys: string[];
  onSelect: (field: FieldDefinition) => void;
  onCustom: () => void;
  onClose: () => void;
}

export function FieldSelectorModal({
  categoryType, existingKeys, onSelect, onCustom, onClose,
}: FieldSelectorModalProps) {
  const definitions = FIELD_DEFINITIONS[categoryType] || [];

  return (
    <ModalShell title="항목 추가" onClose={onClose}>
      <div className="flex flex-col gap-1 max-h-[60vh] overflow-auto">
        {definitions.map((def) => {
          const exists = existingKeys.includes(def.key);
          return (
            <button
              key={def.key}
              onClick={() => !exists && onSelect(def)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-left font-sans border-none cursor-pointer w-full ${
                exists ? "bg-green-50 opacity-60" : "bg-white hover:bg-ink-100"
              }`}
              disabled={exists}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                exists ? "bg-green-500" : "border border-ink-300"
              }`}>
                {exists && <CheckIcon width={12} height={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{def.label}</div>
                <div className="text-[10px] text-ink-400 mt-0.5">
                  {def.type === "number" ? "숫자" : def.type === "date" ? "날짜" :
                   def.type === "select" ? "선택" : def.type === "boolean" ? "예/아니오" :
                   def.type === "textarea" ? "긴 텍스트" : "텍스트"}
                </div>
              </div>
            </button>
          );
        })}

        <button
          onClick={onCustom}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-left font-sans border border-dashed border-ink-300 cursor-pointer w-full bg-white mt-2"
        >
          <div className="w-5 h-5 rounded-md border border-ink-300 flex items-center justify-center text-ink-400 text-xs">+</div>
          <div className="text-[13px] font-medium text-ink-500">직접 입력</div>
        </button>
      </div>
    </ModalShell>
  );
}
