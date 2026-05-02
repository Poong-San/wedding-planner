"use client";

import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/ui/icons";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();

  return (
    <div className="px-5 pb-5">
      <h3 className="text-[15px] font-bold mb-2.5">카테고리 바로가기</h3>
      <div className="grid grid-cols-3 gap-2.5">
        {categories.map((c) => {
          const isDone = c.status === "completed" || c.status === "contracted";
          return (
            <button
              key={c.type}
              onClick={() => router.push(`/category/${c.type}`)}
              className="bg-white border border-ink-200 rounded-xl py-[18px] px-1.5 flex flex-col items-center gap-2 cursor-pointer font-sans"
            >
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-bold ${
                  isDone
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isDone ? <CheckIcon width={16} height={16} /> : c.name.slice(0, 1)}
              </div>
              <span className="text-xs text-ink-700 font-medium">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
