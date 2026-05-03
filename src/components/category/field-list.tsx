"use client";

import type { CategoryField } from "@/types";

interface FieldListProps {
  fields: CategoryField[];
  onFieldClick?: (field: CategoryField) => void;
  onDelete?: (fieldId: string) => void;
}

export function FieldList({ fields, onFieldClick, onDelete }: FieldListProps) {
  if (fields.length === 0) return null;

  return (
    <div className="px-5 pb-4">
      <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-2.5">
        상세 정보
      </div>
      <div className="card p-0">
        {fields.map((f, i) => (
          <div
            key={f.id}
            onClick={() => onFieldClick?.(f)}
            className={`px-4 py-3.5 cursor-pointer flex items-center gap-2 ${
              i < fields.length - 1 ? "border-b border-ink-100" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink-500 mb-0.5">
                {f.fieldLabel}
                {f.isCustom && <span className="ml-1 text-[9px] text-green-600">커스텀</span>}
              </div>
              <div className="text-[13px] font-medium truncate">
                {formatFieldValue(f)}
              </div>
            </div>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(f.id); }}
                className="text-ink-400 text-xs bg-transparent border-none cursor-pointer p-1"
              >✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 금액이 아닌 숫자 필드 키 (명, 개, 분 등)
const NON_CURRENCY_KEYS = new Set([
  "guaranteed_guests", "parking_count", "ceremony_duration", "concurrent_ceremonies",
  "edited_count", "edited_photo_count", "quantity", "size",
]);

// 인원 관련 키
const PERSON_COUNT_KEYS = new Set([
  "guaranteed_guests",
]);

function formatFieldValue(field: CategoryField): string {
  if (!field.fieldValue) return "-";
  if (field.fieldType === "number") {
    const num = Number(field.fieldValue);
    if (PERSON_COUNT_KEYS.has(field.fieldKey)) return `${num.toLocaleString()}명`;
    if (NON_CURRENCY_KEYS.has(field.fieldKey)) return num.toLocaleString();
    // 금액: 정확한 표시
    if (num >= 100000000) return `${(num / 100000000).toFixed(1).replace(/\.0$/, "")}억원`;
    if (num >= 10000) return `${(num / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}만원`;
    return num.toLocaleString() + (num > 0 ? "원" : "");
  }
  if (field.fieldType === "boolean") return field.fieldValue === "true" ? "예" : "아니오";
  return field.fieldValue;
}
