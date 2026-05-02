interface ProgressBarProps {
  percent: number;
  height?: number;
  className?: string;
}

export function ProgressBar({ percent, height = 6, className = "" }: ProgressBarProps) {
  return (
    <div
      className={`bg-ink-100 rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        className="h-full bg-green-500 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}
