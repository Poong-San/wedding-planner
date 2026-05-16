import type { CoupleInfo } from "@/types";
import type { LedgerOwner } from "@/hooks/use-ledger";

const FALLBACK_NAMES: Record<LedgerOwner, string> = {
  groom: "신랑",
  bride: "신부",
  shared: "공동",
};

export function getOwnerShortLabels(couple: CoupleInfo): Record<LedgerOwner, string> {
  return {
    groom: couple.groom?.trim() || FALLBACK_NAMES.groom,
    bride: couple.bride?.trim() || FALLBACK_NAMES.bride,
    shared: FALLBACK_NAMES.shared,
  };
}

export function getOwnerDisplayLabels(couple: CoupleInfo): Record<LedgerOwner, string> {
  const short = getOwnerShortLabels(couple);
  return {
    groom: `${short.groom} (신랑)`,
    bride: `${short.bride} (신부)`,
    shared: short.shared,
  };
}

export function getGuestSideLabels(couple: CoupleInfo): Record<"groom" | "bride", string> {
  const short = getOwnerShortLabels(couple);
  return {
    groom: `${short.groom}측`,
    bride: `${short.bride}측`,
  };
}
