"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerSubNav } from "@/components/ledger/ledger-sub-nav";
import { LedgerAddModal } from "@/components/modals/ledger-add-modal";
import { useLedger, OWNER_COLORS, OWNER_SHORT } from "@/hooks/use-ledger";
import type { LedgerOwner, LedgerType } from "@/hooks/use-ledger";

type OwnerFilter = "all" | LedgerOwner;
type TypeFilter = "all" | "income" | "expense";

export default function LedgerTransactionsPage() {
  const { entries, addEntry, deleteEntry } = useLedger();
  const [showAdd, setShowAdd] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const now = new Date();
  const [ym, setYm] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);

  const monthEntries = entries.filter((e) => e.date.startsWith(ym));
  const filtered = monthEntries.filter((e) => {
    if (ownerFilter !== "all" && e.owner !== ownerFilter) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    return true;
  });

  const monthIncome = monthEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const monthExpense = monthEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  // 날짜별 그룹
  const grouped: Record<string, typeof entries> = {};
  filtered.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const counts = {
    groom: monthEntries.filter((e) => e.owner === "groom").length,
    bride: monthEntries.filter((e) => e.owner === "bride").length,
    shared: monthEntries.filter((e) => e.owner === "shared").length,
  };

  const changeMonth = (delta: number) => {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setYm(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <>
      <PageHeaderWithMenu title="거래내역" />
      <LedgerSubNav />

      <div className="pb-24">
        {/* 월 네비게이션 */}
        <div className="px-5 py-4 flex items-center justify-center gap-4 border-b border-ink-100">
          <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center text-ink-500 bg-transparent border-none cursor-pointer">‹</button>
          <div className="text-center">
            <div className="font-serif text-xl font-bold">{ym.replace("-", "년 ")}월</div>
            <div className="text-[11px] text-ink-500 mt-0.5">
              <span className="text-green-600">+{Math.round(monthIncome / 10000)}만</span>
              <span className="mx-2">·</span>
              <span className="text-rose-500">-{Math.round(monthExpense / 10000)}만</span>
            </div>
          </div>
          <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center text-ink-500 bg-transparent border-none cursor-pointer">›</button>
        </div>

        {/* 필터 */}
        <div className="px-4 py-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          <FilterChip active={ownerFilter === "all"} onClick={() => setOwnerFilter("all")}>
            전체 {monthEntries.length}
          </FilterChip>
          <FilterChip active={ownerFilter === "groom"} color="blue" onClick={() => setOwnerFilter("groom")}>
            신랑 {counts.groom}
          </FilterChip>
          <FilterChip active={ownerFilter === "bride"} color="rose" onClick={() => setOwnerFilter("bride")}>
            신부 {counts.bride}
          </FilterChip>
          <FilterChip active={ownerFilter === "shared"} color="green" onClick={() => setOwnerFilter("shared")}>
            공동 {counts.shared}
          </FilterChip>
        </div>
        <div className="px-4 pb-3 flex gap-1.5">
          <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>수입+지출</FilterChip>
          <FilterChip active={typeFilter === "income"} onClick={() => setTypeFilter("income")}>수입만</FilterChip>
          <FilterChip active={typeFilter === "expense"} onClick={() => setTypeFilter("expense")}>지출만</FilterChip>
        </div>

        {/* 리스트 */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-ink-400">거래가 없어요</div>
          ) : (
            sortedDates.map((date) => {
              const dayEntries = grouped[date];
              const dayTotal = dayEntries.reduce((s, e) => s + (e.type === "expense" ? -e.amount : e.amount), 0);
              const day = new Date(date);
              const weekday = ["일", "월", "화", "수", "목", "금", "토"][day.getDay()];
              return (
                <div key={date} className="mb-3">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <div className="text-[11px] text-ink-500 font-medium">
                      {Number(date.slice(8))} {date.slice(5, 7)}월 · {weekday}요일
                    </div>
                    <div className={`text-[11px] font-bold ${dayTotal < 0 ? "text-rose-500" : "text-green-600"}`}>
                      {dayTotal < 0 ? "" : "+"}{Math.round(dayTotal / 10000)}만
                    </div>
                  </div>
                  <div className="card p-0">
                    {dayEntries.map((e, i) => {
                      const c = OWNER_COLORS[e.owner];
                      return (
                        <div key={e.id} className={`px-3 py-2.5 flex items-center gap-2.5 ${
                          i < dayEntries.length - 1 ? "border-b border-ink-100" : ""
                        }`}>
                          <span className={`w-1 h-8 rounded-full ${c.dot} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold truncate">{e.title}</div>
                            <div className="text-[10px] text-ink-400 mt-0.5">
                              {e.paymentMethod || e.memo || "-"} · {OWNER_SHORT[e.owner]}
                            </div>
                          </div>
                          <div
                            onClick={() => { if (confirm("삭제?")) deleteEntry(e.id); }}
                            className={`text-[13px] font-bold ${e.type === "income" ? "text-green-600" : "text-ink-700"} cursor-pointer`}
                          >
                            {e.type === "income" ? "+" : "-"}{e.amount.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed right-5 bottom-[90px] w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-none cursor-pointer z-40"
      >
        <PlusIcon width={22} height={22} />
      </button>

      {showAdd && <LedgerAddModal onSave={addEntry} onClose={() => setShowAdd(false)} />}
    </>
  );
}

function FilterChip({ active, color, onClick, children }: { active: boolean; color?: "blue" | "rose" | "green"; onClick: () => void; children: React.ReactNode }) {
  const activeClass = color === "blue" ? "bg-blue-500 text-white border-blue-500"
    : color === "rose" ? "bg-rose-500 text-white border-rose-500"
    : color === "green" ? "bg-green-500 text-white border-green-500"
    : "bg-ink-900 text-white border-ink-900";
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border cursor-pointer font-sans ${
        active ? activeClass : "bg-white text-ink-600 border-ink-200"
      }`}
    >
      {children}
    </button>
  );
}
