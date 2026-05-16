export const QUICK_LEDGER_CATEGORIES = [
  { key: "식비", label: "식비" },
  { key: "카페", label: "카페" },
  { key: "쇼핑", label: "쇼핑" },
  { key: "주거", label: "주거" },
  { key: "교통", label: "교통" },
  { key: "의료", label: "의료" },
  { key: "여행", label: "여행" },
  { key: "경조사", label: "경조사" },
];

export function resolveLedgerCategory(selectedCategory: string, customCategory: string): string | null {
  const category = selectedCategory === "custom" ? customCategory.trim() : selectedCategory.trim();
  return category || null;
}
