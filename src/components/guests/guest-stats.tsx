import { formatManWon } from "@/lib/utils";

interface GuestStatsProps {
  mealCount: number;
  giftSum: number;
}

export function GuestStats({ mealCount, giftSum }: GuestStatsProps) {
  return (
    <div className="px-5 pb-3.5">
      <div className="bg-green-500 rounded-2xl p-[18px] text-white flex justify-between">
        <div>
          <div className="text-[11px] opacity-85">예상 식사 인원</div>
          <div className="text-2xl font-bold mt-0.5">{mealCount}명</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] opacity-85">축의금 합계</div>
          <div className="text-2xl font-bold mt-0.5">{formatManWon(giftSum)}만</div>
        </div>
      </div>
    </div>
  );
}
