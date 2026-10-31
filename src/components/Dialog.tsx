import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Knoppen onderaan. */
  footer?: ReactNode;
}

/** Toegankelijke dialoog op basis van het native <dialog>-element (focus en Esc gratis). */
export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="fv-sheet m-auto"
      aria-labelledby="fv-dialog-title"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div className="flex items-start justify-between gap-2 p-5 pb-2">
            <h2 id="fv-dialog-title" className="pt-2 text-xl">
              {title}
            </h2>
            <IconButton
              label="Sluiten"
              icon={<X size={22} aria-hidden="true" />}
              onClick={onClose}
            />
          </div>
          <div className="overflow-y-auto px-5 pb-5">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-line p-4">
              {footer}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
