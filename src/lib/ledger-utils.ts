import type { LedgerEntry, LedgerOwner } from "@/hooks/use-ledger";

export function getMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getLedgerMonthSummary(entries: LedgerEntry[], monthKey: string) {
  const monthEntries = entries.filter((entry) => entry.date.startsWith(monthKey));
  const income = monthEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = monthEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return {
    entries: monthEntries,
    income,
    expense,
    balance: income - expense,
  };
}

export function getLedgerExpenseByOwner(entries: LedgerEntry[], owner: LedgerOwner): number {
  return entries
    .filter((entry) => entry.owner === owner && entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);
}
