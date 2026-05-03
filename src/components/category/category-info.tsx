import { ChevRightIcon } from "@/components/ui/icons";
import type { Category } from "@/types";

interface CategoryInfoProps {
  category: Category;
  onEdit?: () => void;
}

export function CategoryInfo({ category, onEdit }: CategoryInfoProps) {
  const rows = [
    category.manager && { l: "담당자", v: category.manager },
    category.contact && { l: "연락처", v: category.contact },
    category.notes && { l: "메모", v: category.notes },
  ].filter(Boolean) as { l: string; v: string }[];

  if (rows.length === 0) return null;

  return (
    <div className="px-5 pb-4">
      <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-2.5">
        기본 정보
      </div>
      <div className="card p-0">
        {rows.map((r, i) => (
          <div
            key={i}
            onClick={() => onEdit?.()}
            className={`px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors duration-150 hover:bg-ink-50 ${
              i < rows.length - 1 ? "border-b border-ink-100" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink-500 mb-0.5">{r.l}</div>
              <div className="text-[13px] font-medium leading-relaxed">{r.v}</div>
            </div>
            <ChevRightIcon width={14} height={14} className="text-ink-300 flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
