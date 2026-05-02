interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, children, className = "" }: FieldProps) {
  return (
    <div className={className}>
      <div className="text-[11px] text-ink-500 mb-[5px] font-medium">{label}</div>
      {children}
    </div>
  );
}
