import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const OVERLAY_OPEN_CLASS = 'overlay-open';
const EXIT_MS = 440;

type ExampleOverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function ExampleOverlay({ open, onClose, title, children }: ExampleOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  const onCloseRef = useRef(onClose);
  const scrollYRef = useRef(0);

  const isExiting = !open && mounted;
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;
      setMounted(true);
      setReady(false);

      const frame = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(frame);
    }

    setReady(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.add(OVERLAY_OPEN_CLASS);

    return () => {
      document.documentElement.classList.remove(OVERLAY_OPEN_CLASS);
      const target = scrollYRef.current;

      if (Math.abs(window.scrollY - target) > 1) {
        window.scrollTo({ top: target, left: 0, behavior: 'instant' });
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!mounted || typeof document === 'undefined') return null;

  const backdropClass = isExiting ? 'overlay-backdrop-exit' : ready ? 'overlay-backdrop-enter' : 'opacity-0';
  const headerClass = isExiting ? 'overlay-header-exit' : ready ? 'overlay-header-enter' : 'opacity-0';
  const panelClass = isExiting ? 'overlay-panel-exit' : ready ? 'overlay-panel-enter' : 'opacity-0';

  return createPortal(
    <div className='fixed inset-0 z-100 flex flex-col' role='dialog' aria-modal='true' aria-label={title}>
      <div className={`absolute inset-0 bg-background/95 backdrop-blur-md ${backdropClass}`} aria-hidden />

      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,84,76,0.08),transparent_55%)] ${backdropClass}`}
        aria-hidden
      />

      <header
        className={`relative z-10 flex shrink-0 items-center justify-between gap-sm border-surface-variant border-b px-margin py-3 ${headerClass}`}
      >
        <span className='min-w-0 flex-1 truncate pr-2 font-label-mono text-on-surface-variant text-xs tracking-widest sm:text-sm'>
          {title}
        </span>
        <button
          type='button'
          onClick={onClose}
          className='shrink-0 cursor-pointer border border-surface-variant bg-transparent px-3 py-1 font-label-mono text-on-surface-variant text-xs tracking-widest transition-colors hover:border-primary hover:text-primary sm:px-4 sm:py-1.5 sm:text-sm'
        >
          CLOSE
        </button>
      </header>

      <div
        className={`relative z-10 flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden p-sm md:p-margin ${panelClass}`}
      >
        {ready && open && (
          <div
            className='overlay-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-primary/10 via-primary/5 to-transparent'
            aria-hidden
          />
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
