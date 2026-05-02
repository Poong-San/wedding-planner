interface DonutChartProps {
  percent: number;
  used: number;
  total: number;
}

export function DonutChart({ percent, used, total }: DonutChartProps) {
  const r = 80;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#f1f3f1" strokeWidth="20" />
        <circle
          cx="100" cy="100" r={r} fill="none" stroke="oklch(0.68 0.11 155)" strokeWidth="20"
          strokeDasharray={`${(circumference * percent) / 100} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[11px] text-ink-500">사용</div>
        <div className="text-[26px] font-bold text-green-700 mt-0.5">{Math.round(percent)}%</div>
        <div className="text-[11px] text-ink-500 mt-1">
          {Math.round(used / 10000).toLocaleString()} / {Math.round(total / 10000).toLocaleString()}만
        </div>
      </div>
    </div>
  );
}
