import { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

/** Centered modal dialog primitive (distinct from Drawer, which slides from the right). */
export default function Modal({ open, onClose, children, width = 460 }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width,
          maxWidth: '92vw',
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: 10,
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
          padding: 22,
          animation: 'command-in 0.15s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
