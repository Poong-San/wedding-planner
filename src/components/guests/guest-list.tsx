import { formatManWon } from "@/lib/utils";
import type { Guest } from "@/types";

interface GuestListProps {
  guests: Guest[];
  onGuestClick?: (id: number | string) => void;
}

export function GuestList({ guests, onGuestClick }: GuestListProps) {
  if (guests.length === 0) {
    return (
      <div className="py-[30px] text-center text-xs text-ink-400">하객을 추가해보세요</div>
    );
  }

  return (
    <div className="px-5 pt-3.5 pb-4">
      {guests.map((g, i) => (
        <div
          key={g.id}
          onClick={() => onGuestClick?.(g.id)}
          className={`flex items-center gap-3 py-3 cursor-pointer ${
            i < guests.length - 1 ? "border-b border-ink-100" : ""
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            g.side === "bride" ? "bg-[#b85a73]" : "bg-green-500"
          }`} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold">
              {g.name} <span className="text-[11px] text-ink-500 font-normal">· {g.rel}</span>
            </div>
          </div>
          <span className={`chip text-[10px] ${
            g.att === "attending" ? "chip-done" :
            g.att === "not_attending" ? "chip-pending" : "chip-warn"
          }`}>
            {g.att === "attending" ? "참석" : g.att === "not_attending" ? "불참" : "미정"}
          </span>
          {g.meal && (
            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">식사</span>
          )}
          <div className="text-[11px] text-ink-700 min-w-[42px] text-right">
            {g.gift > 0 ? `${formatManWon(g.gift)}만` : "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
