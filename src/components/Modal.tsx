import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  refId?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, refId, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lcars-modal__backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="lcars-modal"
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lcars-modal__header">
          <span className="lcars-modal__title">{title}</span>
          {refId ? <span className="lcars-modal__id">{refId}</span> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
