import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  IndianRupee,
  Search,
  Building2,
  AlertTriangle,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Waypoints,
  Boxes,
  Bug,
  KeyRound,
  Radar,
  Cloud,
  UserCog,
  Code2,
  ListChecks,
  Inbox,
  FileText,
  ScrollText,
  Plug,
  Terminal as TerminalIcon,
  Settings,
  FileCode2,
} from 'lucide-react';
import { useUiStore, toggleSidebar, closeMobileNav } from '../../lib/uiStore';
import { toast } from '../../lib/toastStore';
import Logo from '../common/Logo';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Security Dashboard', to: '/security', icon: <ShieldCheck size={16} /> },
      { label: 'Financial Dashboard', to: '/financial', icon: <IndianRupee size={16} /> },
    ],
  },
  {
    title: 'Investigate',
    items: [
      { label: 'Findings', to: '/findings', icon: <Search size={16} /> },
      { label: 'Assets', to: '/assets', icon: <Building2 size={16} /> },
      { label: 'Risk Cases', to: '/risks', icon: <AlertTriangle size={16} /> },
      { label: 'Attack Paths', to: '/attack-paths', icon: <Waypoints size={16} /> },
      { label: 'Resources', to: '/resources', icon: <Boxes size={16} /> },
    ],
  },
  {
    title: 'Detect',
    items: [
      { label: 'Vulnerabilities', to: '/vulnerabilities', icon: <Bug size={16} /> },
      { label: 'Secrets', to: '/secrets', icon: <KeyRound size={16} /> },
      { label: 'Threat Intelligence', to: '/threat-intelligence', icon: <Radar size={16} /> },
      { label: 'Cloud Security', to: '/cloud-security', icon: <Cloud size={16} /> },
      { label: 'Identity Security', to: '/identity-security', icon: <UserCog size={16} /> },
      { label: 'Code Security', to: '/code-security', icon: <Code2 size={16} /> },
    ],
  },
  {
    title: 'Remediate',
    items: [
      { label: 'Scenarios', to: '/scenarios', icon: <RefreshCw size={16} /> },
      { label: 'Recommendations', to: '/recommendations', icon: <ListChecks size={16} /> },
      { label: 'Remediation Queue', to: '/remediation-queue', icon: <Inbox size={16} /> },
      { label: 'Investment Optimizer', to: '/investments', icon: <Lightbulb size={16} /> },
    ],
  },
  {
    title: 'Govern',
    items: [
      { label: 'Compliance', to: '/compliance', icon: <CheckCircle2 size={16} /> },
      { label: 'Policies', to: '/policies', icon: <FileText size={16} /> },
      { label: 'Reports', to: '/reports', icon: <ScrollText size={16} /> },
    ],
  },
  {
    title: 'Platform',
    items: [
      { label: 'Integrations', to: '/integrations', icon: <Plug size={16} /> },
      { label: 'API', to: '/api-reference', icon: <TerminalIcon size={16} /> },
      { label: 'Dev Workspace', to: '/demo/vscode', icon: <FileCode2 size={16} /> },
      { label: 'Settings', to: '/settings', icon: <Settings size={16} /> },
    ],
  },
];

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);

  return (
    <>
      {mobileNavOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={closeMobileNav}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 19, display: 'none' }}
        />
      )}
      <aside
      className={`app-sidebar${collapsed ? ' sidebar-collapsed' : ''}${mobileNavOpen ? ' mobile-nav-open' : ''}`}
      style={{
        width: 240,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--bg-border)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        transition: 'width 0.15s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: collapsed ? '18px 0' : '18px 20px 4px',
          justifyItems: 'center',
        }}
      >
        <div style={{ paddingLeft: collapsed ? 22 : 0 }}>
          <Logo size={22} withWordmark={!collapsed} wordmarkSize={17} />
        </div>
      </div>
      {!collapsed && (
        <div style={{ padding: '0 20px 14px', borderBottom: '1px solid var(--bg-border)' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: 500 }}>Security Intelligence Platform</span>
        </div>
      )}
      {collapsed && <div style={{ borderBottom: '1px solid var(--bg-border)', marginBottom: 0, paddingBottom: 14 }} />}

      {/* Organization selector */}
      <div
        className="nav-item-collapsed"
        role="button"
        aria-haspopup="listbox"
        onClick={() => toast.info('Single-organization workspace', 'NovaPay Financial Services is the only organization in this workspace.')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toast.info('Single-organization workspace', 'NovaPay Financial Services is the only organization in this workspace.');
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 8,
          padding: collapsed ? '14px 0' : '14px 20px',
          borderBottom: '1px solid var(--bg-border)',
          cursor: 'pointer',
          position: 'relative',
        }}
        tabIndex={0}
      >
        {collapsed ? (
          <Building2 size={16} color="var(--text-muted)" />
        ) : (
          <>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Organization</div>
              <div
                className="org-selector-text"
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title="NovaPay Financial Services"
              >
                NovaPay Financial Services
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </>
        )}
        {collapsed && <span className="nav-tooltip">NovaPay Financial Services</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }} aria-label="Primary">
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 16 }}>
            {!collapsed && (
              <div
                className="nav-section-title"
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-subtle)',
                  padding: '0 12px 6px',
                }}
              >
                {section.title}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="nav-item-collapsed"
                title={collapsed ? item.label : undefined}
                onClick={closeMobileNav}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: 10,
                  padding: collapsed ? '10px 0' : '8px 12px',
                  marginBottom: 1,
                  borderRadius: 6,
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  position: 'relative',
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = e.currentTarget.getAttribute('aria-current') === 'page' ? 'var(--bg-elevated)' : 'transparent';
                  }
                }}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
                {collapsed && <span className="nav-tooltip">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="icon-btn"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          margin: collapsed ? '0 auto 10px' : '0 12px 10px auto',
          display: 'flex',
        }}
      >
        {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div
          className="sidebar-footer-text"
          style={{
            padding: '12px 20px 16px',
            borderTop: '1px solid var(--bg-border)',
            fontSize: '0.6875rem',
            color: 'var(--text-subtle)',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>NovaPay FinSec</div>
          <div>v1.0 · Enterprise Preview</div>
        </div>
      )}
      </aside>
    </>
  );
}
