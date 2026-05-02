interface ChipProps {
  variant: "pending" | "active" | "done" | "warn";
  children: React.ReactNode;
  className?: string;
}

export function Chip({ variant, children, className = "" }: ChipProps) {
  return (
    <span className={`chip chip-${variant} ${className}`}>
      {children}
    </span>
  );
}
