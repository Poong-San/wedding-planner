"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterIcon, CheckIcon } from "@/components/ui/icons";
import { ProgressBar } from "@/components/ui/progress-bar";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export default function ReservationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const cats = Object.values(MOCK_CATEGORIES);

  const filtered = cats.filter((c) => {
    if (filter === "all") return true;
    if (filter === "in_progress") return ["consulting", "contracted", "in_progress"].includes(c.status);
    if (filter === "completed") return c.status === "completed";
    if (filter === "pending") return c.status === "pending";
    return true;
  });

  const completedCount = cats.filter(
    (c) => c.status === "completed" || c.status === "contracted"
  ).length;

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold m-0">예약현황</h1>
        <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
          <FilterIcon width={16} height={16} />
        </button>
      </div>

      <div className="px-5 pb-3.5">
        <div className="card-soft">
          <div className="flex justify-between mb-2">
            <span className="text-[13px] font-semibold">전체 진행률</span>
            <span className="text-[13px] font-bold text-green-700">{completedCount} / {cats.length}</span>
          </div>
          <ProgressBar percent={(completedCount / cats.length) * 100} />
        </div>
      </div>

      <div className="flex gap-1.5 px-5 pb-3.5">
        {[
          { k: "all", l: "전체" },
          { k: "in_progress", l: "진행중" },
          { k: "completed", l: "완료" },
          { k: "pending", l: "미정" },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer font-sans ${
              filter === f.k
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-ink-700 border-ink-200"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-ink-400">해당하는 카테고리가 없어요</div>
        ) : (
          filtered.map((c) => {
            const isDone = c.status === "completed" || c.status === "contracted";
            const isActive = c.status === "consulting" || c.status === "in_progress";
            return (
              <div
                key={c.type}
                onClick={() => router.push(`/category/${c.type}`)}
                className="p-3.5 bg-white border border-ink-200 rounded-xl mb-2 flex items-center gap-3 cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                  isDone ? "bg-green-500 text-white" : isActive ? "bg-green-100 text-green-700" : "bg-ink-100 text-ink-400"
                }`}>
                  {isDone ? <CheckIcon width={14} height={14} /> : c.name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">{c.name}</div>
                  <div className="text-[11px] text-ink-500 mt-0.5 truncate">{c.vendor || "업체 미정"}</div>
                </div>
                <span className={`chip ${isDone ? "chip-done" : isActive ? "chip-active" : "chip-pending"}`}>
                  {isDone ? "완료" : isActive ? "진행중" : "미정"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
