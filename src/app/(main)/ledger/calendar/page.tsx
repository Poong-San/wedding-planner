"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { LedgerSubNav } from "@/components/ledger/ledger-sub-nav";
import { LedgerAddModal } from "@/components/modals/ledger-add-modal";
import { useLedger, OWNER_COLORS, OWNER_SHORT } from "@/hooks/use-ledger";

export default function LedgerCalendarPage() {
  const { entries, addEntry } = useLedger();
  const [showAdd, setShowAdd] = useState(false);
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const [selectedDate, setSelectedDate] = useState(now.toISOString().slice(0, 10));

  const ymStr = `${ym.y}-${String(ym.m).padStart(2, "0")}`;
  const monthEntries = entries.filter((e) => e.date.startsWith(ymStr));
  const income = monthEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const expense = monthEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  const changeMonth = (delta: number) => {
    const d = new Date(ym.y, ym.m - 1 + delta, 1);
    setYm({ y: d.getFullYear(), m: d.getMonth() + 1 });
  };

  // 월 그리드
  const firstDay = new Date(ym.y, ym.m - 1, 1);
  const lastDay = new Date(ym.y, ym.m, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dayTotal = (day: number) => {
    const dateStr = `${ymStr}-${String(day).padStart(2, "0")}`;
    const dayEntries = entries.filter((e) => e.date === dateStr);
    const inc = dayEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const exp = dayEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    return { inc, exp, net: inc - exp };
  };

  const selectedEntries = entries.filter((e) => e.date === selectedDate);
  const selectedTotal = selectedEntries.reduce((s, e) => s + (e.type === "expense" ? -e.amount : e.amount), 0);

  return (
    <>
      <PageHeaderWithMenu title="가계부 캘린더" />
      <LedgerSubNav />

      <div className="pb-24">
        {/* 월 요약 */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-center gap-4 mb-3">
            <button onClick={() => changeMonth(-1)} className="text-ink-500 bg-transparent border-none cursor-pointer">‹</button>
            <div className="font-serif text-2xl font-bold">{ym.m}월 <span className="text-sm text-ink-500">{ym.y}</span></div>
            <button onClick={() => changeMonth(1)} className="text-ink-500 bg-transparent border-none cursor-pointer">›</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <div className="text-[10px] text-ink-500">수입</div>
              <div className="text-[14px] font-bold text-green-600 font-serif">+{Math.round(income / 10000)}만</div>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg">
              <div className="text-[10px] text-ink-500">지출</div>
              <div className="text-[14px] font-bold text-rose-500 font-serif">-{Math.round(expense / 10000)}만</div>
            </div>
            <div className="p-2 bg-ink-100 rounded-lg">
              <div className="text-[10px] text-ink-500">잔액</div>
              <div className="text-[14px] font-bold text-ink-900 font-serif">+{Math.round((income - expense) / 10000)}만</div>
            </div>
          </div>
        </div>

        {/* 달력 */}
        <div className="px-3">
          <div className="grid grid-cols-7 text-center text-[10px] text-ink-400 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="aspect-square" />;
              const dateStr = `${ymStr}-${String(d).padStart(2, "0")}`;
              const { inc, exp } = dayTotal(d);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === now.toISOString().slice(0, 10);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square flex flex-col items-center p-1 rounded-md border cursor-pointer font-sans ${
                    isSelected
                      ? "bg-green-500 text-white border-green-500"
                      : isToday
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-transparent hover:bg-ink-50"
                  }`}
                >
                  <div className={`text-[11px] font-bold ${isSelected ? "text-white" : ""}`}>{d}</div>
                  {inc > 0 && <div className={`text-[8px] font-semibold ${isSelected ? "text-green-100" : "text-green-600"}`}>+{Math.round(inc / 10000)}</div>}
                  {exp > 0 && <div className={`text-[8px] font-semibold ${isSelected ? "text-rose-100" : "text-rose-500"}`}>-{Math.round(exp / 10000)}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택된 날짜 상세 */}
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12px] font-semibold">
              {selectedDate.slice(5).replace("-", "월 ")}일 · {selectedEntries.length}건
            </div>
            <div className={`text-[12px] font-bold ${selectedTotal < 0 ? "text-rose-500" : "text-green-600"}`}>
              {selectedTotal >= 0 ? "+" : ""}{selectedTotal.toLocaleString()}
            </div>
          </div>
          {selectedEntries.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-ink-400">거래 없음</div>
          ) : (
            <div className="card p-0">
              {selectedEntries.map((e, i) => {
                const c = OWNER_COLORS[e.owner];
                return (
                  <div key={e.id} className={`px-3 py-2.5 flex items-center gap-2.5 ${
                    i < selectedEntries.length - 1 ? "border-b border-ink-100" : ""
                  }`}>
                    <span className={`w-1 h-8 rounded-full ${c.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate">{e.title}</div>
                      <div className="text-[10px] text-ink-400">{OWNER_SHORT[e.owner]}</div>
                    </div>
                    <div className={`text-[13px] font-bold ${e.type === "income" ? "text-green-600" : "text-ink-700"}`}>
                      {e.type === "income" ? "+" : "-"}{e.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
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
