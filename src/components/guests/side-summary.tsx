interface SideSummaryProps {
  groomCount: number;
  groomAtt: number;
  groomUnd: number;
  brideCount: number;
  brideAtt: number;
  brideUnd: number;
}

export function SideSummary({ groomCount, groomAtt, groomUnd, brideCount, brideAtt, brideUnd }: SideSummaryProps) {
  return (
    <div className="px-5 pb-3.5 flex gap-2">
      <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3.5">
        <div className="text-[11px] text-green-700">신랑측</div>
        <div className="text-lg font-bold mt-0.5">
          {groomCount}<span className="text-[11px] font-normal text-ink-500">명</span>
        </div>
        <div className="text-[10px] text-ink-500 mt-0.5">참석 {groomAtt} · 미정 {groomUnd}</div>
      </div>
      <div className="flex-1 bg-[#fef0f3] border border-[#f7cfd9] rounded-xl p-3.5">
        <div className="text-[11px] text-[#b85a73]">신부측</div>
        <div className="text-lg font-bold mt-0.5">
          {brideCount}<span className="text-[11px] font-normal text-ink-500">명</span>
        </div>
        <div className="text-[10px] text-ink-500 mt-0.5">참석 {brideAtt} · 미정 {brideUnd}</div>
      </div>
    </div>
  );
}
