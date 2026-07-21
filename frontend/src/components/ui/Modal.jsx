import { createPortal } from "react-dom";
import Button from "./Button.jsx";
import { classNames } from "../../lib/classNames.js";

export default function Modal({ open, title, children, onClose, className }) {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        className={classNames(
          "w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              {title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </Button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
