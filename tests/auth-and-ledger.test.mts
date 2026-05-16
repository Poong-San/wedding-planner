import test from "node:test";
import assert from "node:assert/strict";
import { parseAllowedEmails, isEmailAllowed } from "../src/lib/auth/allowed-emails.ts";
import { getGuestSideLabels, getOwnerDisplayLabels, getOwnerShortLabels } from "../src/lib/couple-labels.ts";
import { getLedgerExpenseByOwner, getLedgerMonthSummary } from "../src/lib/ledger-utils.ts";
import type { LedgerEntry } from "../src/hooks/use-ledger.ts";

test("allowed email parsing trims, lowercases, and rejects empty allowlists", () => {
  const allowed = parseAllowedEmails(" USER@example.com, partner@example.com ,, ");

  assert.deepEqual(allowed, ["user@example.com", "partner@example.com"]);
  assert.equal(isEmailAllowed("user@example.com", allowed), true);
  assert.equal(isEmailAllowed("USER@example.com", allowed), true);
  assert.equal(isEmailAllowed("other@example.com", allowed), false);
  assert.equal(isEmailAllowed("user@example.com", []), false);
});

test("ledger summary includes only the requested month and separates income from expenses", () => {
  const entries: LedgerEntry[] = [
    entry({ id: "1", date: "2026-05-01", amount: 1_000_000, type: "income", owner: "shared" }),
    entry({ id: "2", date: "2026-05-02", amount: 300_000, type: "expense", owner: "groom" }),
    entry({ id: "3", date: "2026-04-30", amount: 99_000, type: "expense", owner: "bride" }),
  ];

  const summary = getLedgerMonthSummary(entries, "2026-05");

  assert.equal(summary.entries.length, 2);
  assert.equal(summary.income, 1_000_000);
  assert.equal(summary.expense, 300_000);
  assert.equal(summary.balance, 700_000);
});

test("ledger owner totals ignore income and other owners", () => {
  const entries: LedgerEntry[] = [
    entry({ id: "1", amount: 100_000, type: "expense", owner: "groom" }),
    entry({ id: "2", amount: 50_000, type: "income", owner: "groom" }),
    entry({ id: "3", amount: 80_000, type: "expense", owner: "bride" }),
  ];

  assert.equal(getLedgerExpenseByOwner(entries, "groom"), 100_000);
});

test("couple labels use saved names and fall back to role names", () => {
  const named = {
    bride: "수진",
    groom: "도윤",
    weddingDate: "2026-05-17",
    message: "",
  };

  assert.deepEqual(getOwnerShortLabels(named), {
    groom: "도윤",
    bride: "수진",
    shared: "공동",
  });
  assert.equal(getOwnerDisplayLabels(named).groom, "도윤 (신랑)");
  assert.equal(getGuestSideLabels(named).bride, "수진측");

  const unnamed = { bride: "", groom: "", weddingDate: "", message: "" };
  assert.equal(getOwnerDisplayLabels(unnamed).bride, "신부 (신부)");
  assert.equal(getGuestSideLabels(unnamed).groom, "신랑측");
});

function entry(overrides: Partial<LedgerEntry>): LedgerEntry {
  return {
    id: "id",
    categoryType: null,
    title: "테스트",
    amount: 0,
    date: "2026-05-01",
    memo: "",
    owner: "shared",
    type: "expense",
    isRecurring: false,
    recurringDay: null,
    paymentMethod: "",
    isPlanned: false,
    ...overrides,
  };
}
