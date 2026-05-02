"use client";

interface ModalShellProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalShell({ title, onClose, children }: ModalShellProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center"
    >
      <div className="w-full max-w-[480px]">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-white rounded-t-[20px] px-5 pt-[18px] pb-6 max-h-[80vh] overflow-auto"
          style={{ animation: "slideUp 0.25s ease-out" }}
        >
          <div className="w-9 h-1 bg-ink-200 rounded-sm mx-auto mb-3.5" />

          {title && (
            <div className="flex justify-between items-center mb-3.5">
              <h2 className="text-base font-bold m-0">{title}</h2>
              <button
                onClick={onClose}
                className="border-none bg-transparent cursor-pointer text-base text-ink-500 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
