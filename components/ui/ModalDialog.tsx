'use client';

import { useImperativeHandle, useRef, type MouseEvent, type ReactNode, type Ref } from 'react';

export interface ModalDialogHandle {
  open: () => void;
  close: () => void;
  readonly element: HTMLDialogElement | null;
}

/**
 * Thin wrapper over the native <dialog> modal (audit RC7: V1 hand-rolled focus traps).
 * The platform provides: focus trap, Esc to close, inert background, focus return to the opener,
 * top-layer stacking. Body scroll is locked in CSS via `html:has(dialog[open])`.
 */
export default function ModalDialog({
  id,
  label,
  className,
  children,
  onClose,
  closeOnBackdrop = true,
  handle,
}: {
  id?: string;
  label: string;
  className?: string;
  children: ReactNode;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  handle?: Ref<ModalDialogHandle>;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useImperativeHandle(
    handle,
    () => ({
      open: () => {
        const d = ref.current;
        if (d && !d.open) d.showModal();
      },
      close: () => ref.current?.close(),
      get element() {
        return ref.current;
      },
    }),
    [],
  );

  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && e.target === ref.current) ref.current?.close();
  };

  return (
    <dialog ref={ref} id={id} aria-label={label} className={className} onClose={onClose} onClick={onClick}>
      {children}
    </dialog>
  );
}
