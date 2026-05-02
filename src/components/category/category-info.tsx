import type { Category } from "@/types";

interface CategoryInfoProps {
  category: Category;
}

export function CategoryInfo({ category }: CategoryInfoProps) {
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
            className={`px-4 py-3.5 ${i < rows.length - 1 ? "border-b border-ink-100" : ""}`}
          >
            <div className="text-[11px] text-ink-500 mb-0.5">{r.l}</div>
            <div className="text-[13px] font-medium leading-relaxed">{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
