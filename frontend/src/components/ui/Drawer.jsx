import { createPortal } from "react-dom";
import Button from "./Button.jsx";

export default function Drawer({
  open,
  title,
  children,
  onClose,
  side = "right",
}) {
  if (!open) {
    return null;
  }

  const sideClasses = side === "left" ? "left-0" : "right-0";

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Close drawer overlay"
        onClick={onClose}
      />
      <aside
        className={`${sideClasses} absolute top-0 h-full w-full max-w-md border-l border-[var(--border)] bg-white p-6 shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close drawer"
          >
            Close
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}
