interface Props {
  size?: number;
  withWordmark?: boolean;
  wordmarkSize?: number;
}

/**
 * CRISPR product mark — a hand-drawn SVG shield with a scan/pulse motif.
 * Used in the sidebar, favicon fallback, and dashboard header. Centralizing
 * it here means the brand mark is defined exactly once.
 */
export function ShieldMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L4 5V11.5C4 16.2 7.2 20.4 12 22C16.8 20.4 20 16.2 20 11.5V5L12 2Z"
        fill="url(#crispr-shield-grad)"
        stroke="#2563eb"
        strokeWidth="1"
      />
      <path d="M8.5 12.2L11 14.7L15.7 9.3" stroke="#f0f6fc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="crispr-shield-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ size = 22, withWordmark = true, wordmarkSize = 18 }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ShieldMark size={size} />
      {withWordmark && (
        <span
          style={{
            fontWeight: 800,
            fontSize: wordmarkSize,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
          className="nav-label"
        >
          CRISPR
          <span style={{ color: 'var(--accent-blue)' }}>.</span>
        </span>
      )}
    </div>
  );
}
