import { useEffect, useRef } from 'react';
import { useDemoStore } from '../../demo/demoStore';

interface Props {
  height?: number;
  title?: string;
}

const LINE_CLASS: Record<string, string> = {
  command: 'terminal-line-command',
  info: 'terminal-line-info',
  ok: 'terminal-line-ok',
  warn: 'terminal-line-warn',
  error: 'terminal-line-error',
  result: 'terminal-line-result',
};

/**
 * Lightweight terminal renderer synchronized to the demo engine's
 * terminalLines state (src/demo/demoStore.ts). This is a hand-built
 * substitute for xterm.js — there is no npm registry access in this
 * sandbox to add it as a real dependency. The transcript model
 * (array of {id,text,kind}) is intentionally simple so swapping in a
 * real xterm.js instance later only requires changing this render
 * function's internals, not any calling code.
 */
export default function Terminal({ height = 220, title = 'crispr — scan' }: Props) {
  const lines = useDemoStore((s) => s.terminalLines);
  const isRunning = useDemoStore((s) => s.isRunning);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [lines.length]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#161b22',
          border: '1px solid var(--bg-border)',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          padding: '6px 12px',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ marginLeft: 8, fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{title}</span>
      </div>
      <div className="terminal-window" style={{ height, borderRadius: '0 0 8px 8px', borderTop: 'none' }}>
        {lines.map((l) => (
          <div key={l.id} className={LINE_CLASS[l.kind]}>
            {l.text || '\u00A0'}
          </div>
        ))}
        {isRunning && <span className="terminal-cursor" />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
