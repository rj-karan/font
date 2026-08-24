import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  RefreshCw,
  Download,
  Play,
  ChevronDown,
  Loader2,
  Menu,
} from 'lucide-react';
import { openCommandPalette, useUiStore, setFilter, toggleMobileNav } from '../../lib/uiStore';
import { useDemoStore, runAnalysis } from '../../demo/demoStore';
import { toast } from '../../lib/toastStore';

const TIME_RANGES: { id: any; label: string }[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: '6m', label: '6 months' },
  { id: '1y', label: '1 year' },
];

const ENVIRONMENTS: { id: any; label: string }[] = [
  { id: 'all', label: 'All Environments' },
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
  { id: 'development', label: 'Development' },
];

export default function TopBar() {
  const navigate = useNavigate();
  const filters = useUiStore((s) => s.filters);
  const isRunning = useDemoStore((s) => s.isRunning);
  const progressPct = useDemoStore((s) => s.progressPct);
  const [envOpen, setEnvOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.info('Refreshing dashboard data…');
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Dashboard refreshed');
    }, 900);
  };

  const handleExport = () => {
    toast.success('Export started', 'crispr-security-report.pdf will download shortly.');
  };

  return (
    <header
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid var(--bg-border)',
        background: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 15,
        gap: 12,
      }}
    >
      {/* Mobile nav toggle — hidden on desktop via CSS, shown under 768px */}
      <button
        className="icon-btn mobile-menu-btn"
        style={{ display: 'none' }}
        onClick={toggleMobileNav}
        aria-label="Toggle navigation menu"
      >
        <Menu size={16} />
      </button>

      {/* Global search / command palette trigger */}
      <button
        onClick={openCommandPalette}
        className="topbar-search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-base)',
          border: '1px solid var(--bg-border)',
          borderRadius: 6,
          padding: '6px 10px',
          width: 320,
          maxWidth: '100%',
          cursor: 'text',
          textAlign: 'left',
        }}
        aria-label="Open command palette"
      >
        <Search size={14} color="var(--text-muted)" />
        <span className="topbar-search-placeholder" style={{ flex: 1, color: 'var(--text-subtle)', fontSize: '0.8125rem' }}>
          Search assets, findings, CVEs, repositories...
        </span>
        <span className="kbd">Ctrl K</span>
      </button>

      {/* Environment selector */}
      <div className="topbar-env-select" style={{ position: 'relative' }}>
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', padding: '6px 10px' }}
          onClick={() => setEnvOpen((v) => !v)}
        >
          {ENVIRONMENTS.find((e) => e.id === filters.environment)?.label}
          <ChevronDown size={12} />
        </button>
        {envOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: 6,
              minWidth: 180,
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
            onMouseLeave={() => setEnvOpen(false)}
          >
            {ENVIRONMENTS.map((e) => (
              <button
                key={e.id}
                className="command-result-row"
                style={{ borderRadius: 0, width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit', color: 'inherit' }}
                onClick={() => {
                  setFilter('environment', e.id);
                  setEnvOpen(false);
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time range selector */}
      <div className="topbar-range-select" style={{ position: 'relative' }}>
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', padding: '6px 10px' }}
          onClick={() => setRangeOpen((v) => !v)}
        >
          {TIME_RANGES.find((r) => r.id === filters.timeRange)?.label}
          <ChevronDown size={12} />
        </button>
        {rangeOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: 6,
              minWidth: 140,
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
            onMouseLeave={() => setRangeOpen(false)}
          >
            {TIME_RANGES.map((r) => (
              <button
                key={r.id}
                className="command-result-row"
                style={{ borderRadius: 0, width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit', color: 'inherit' }}
                onClick={() => {
                  setFilter('timeRange', r.id);
                  setRangeOpen(false);
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* System status */}
      <div
        className="tooltip-wrap topbar-status"
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}
        tabIndex={0}
      >
        <span className="status-live-dot" />
        <span>All systems operational</span>
        <span className="tooltip-bubble">13 of 13 connected sources reporting normally. Last health check 40s ago.</span>
      </div>

      {/* Refresh */}
      <button className="icon-btn" onClick={handleRefresh} aria-label="Refresh dashboard data" title="Refresh">
        <RefreshCw size={15} className={refreshing ? 'spin-refresh' : ''} style={refreshing ? { animation: 'spin-refresh 0.8s linear infinite' } : undefined} />
      </button>

      {/* Export */}
      <button className="icon-btn" onClick={handleExport} aria-label="Export report" title="Export">
        <Download size={15} />
      </button>

      {/* Run Analysis */}
      <button
        className="btn-primary run-analysis-btn"
        style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 128, justifyContent: 'center' }}
        onClick={() => runAnalysis()}
        disabled={isRunning}
        aria-label="Run Analysis"
      >
        {isRunning ? (
          <>
            <Loader2 size={14} style={{ animation: 'spin-refresh 0.8s linear infinite' }} />
            <span className="run-analysis-label">{progressPct}%</span>
          </>
        ) : (
          <>
            <Play size={14} /> <span className="run-analysis-label">Run Analysis</span>
          </>
        )}
      </button>

      {/* Help */}
      <button className="icon-btn" aria-label="Help" title="Help" onClick={() => toast.info('CRISPR Docs', 'Documentation portal would open in a new tab.')}>
        <HelpCircle size={16} />
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button className="icon-btn" style={{ position: 'relative' }} aria-label="Notifications" onClick={() => setNotifOpen((v) => !v)}>
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--sev-critical)',
            }}
          />
        </button>
        {notifOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              width: 300,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: 8,
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              padding: 8,
            }}
            onMouseLeave={() => setNotifOpen(false)}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', padding: '4px 8px 8px' }}>Notifications</div>
            {[
              { title: 'New CRITICAL finding', body: 'Authentication API — auth bypass validated by HackerOne', color: 'var(--sev-critical)', path: '/findings?severity=CRITICAL' },
              { title: 'Integration warning', body: 'Jira sync completed with 1 error', color: 'var(--sev-medium)', path: '/integrations' },
              { title: 'Report ready', body: 'Q3 2026 Board Risk Report has been generated', color: 'var(--accent-cyan)', path: '/reports' },
            ].map((n) => (
              <div
                key={n.title}
                style={{ padding: '8px', borderRadius: 6, cursor: 'pointer' }}
                className="command-result-row"
                tabIndex={0}
                role="button"
                onClick={() => {
                  setNotifOpen(false);
                  navigate(n.path);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setNotifOpen(false);
                    navigate(n.path);
                  }
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{n.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          aria-label="User menu"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.75rem',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          NP
        </button>
        {profileOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              width: 200,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: 8,
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--bg-border)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Neha Patel</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>CISO · NovaPay</div>
            </div>
            <button
              className="command-result-row"
              style={{ borderRadius: 0, width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit', color: 'inherit' }}
              onClick={() => {
                setProfileOpen(false);
                navigate('/settings');
              }}
            >
              Settings
            </button>
            <button
              className="command-result-row"
              style={{ borderRadius: 0, width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit', color: 'inherit' }}
              onClick={() => {
                setProfileOpen(false);
                navigate('/integrations');
              }}
            >
              Integrations
            </button>
            <button
              className="command-result-row"
              style={{ borderRadius: 0, width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit', color: 'inherit' }}
              onClick={() => {
                setProfileOpen(false);
                toast.info('Signed out (demo mode)');
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
