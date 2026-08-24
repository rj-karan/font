import { useState } from 'react';
import { Inbox, GitPullRequest, UserPlus, CheckCircle2 } from 'lucide-react';
import { REMEDIATION_SCENARIOS } from '../demo/fixtures';
import SeverityBadge from '../components/common/SeverityBadge';
import KPICard from '../components/common/KPICard';
import OpenPrModal from '../components/codesecurity/OpenPrModal';
import { formatRupees } from '../utils/format';
import { toast } from '../lib/toastStore';
import type { RemediationScenario, ScenarioStatus } from '../types';

const STATUS_LABEL: Record<ScenarioStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  PR_OPENED: 'PR Opened',
  RESOLVED: 'Resolved',
};

const STATUS_COLOR: Record<ScenarioStatus, string> = {
  NOT_STARTED: '#8b949e',
  IN_PROGRESS: '#06b6d4',
  PR_OPENED: '#2563eb',
  RESOLVED: '#22c55e',
};

export default function RemediationQueue() {
  const [scenarios, setScenarios] = useState<RemediationScenario[]>(REMEDIATION_SCENARIOS.map((s) => ({ ...s })));
  const [prTarget, setPrTarget] = useState<RemediationScenario | null>(null);

  const updateStatus = (id: string, status: ScenarioStatus) => {
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const assign = (s: RemediationScenario) => {
    toast.success('Assigned', `${s.title} assigned to ${s.owner?.name ?? 'the owning team'}.`);
    updateStatus(s.id, 'IN_PROGRESS');
  };

  const markResolved = (s: RemediationScenario) => {
    updateStatus(s.id, 'RESOLVED');
    toast.success('Marked resolved', s.title);
  };

  const totalRiskReduction = scenarios.filter((s) => s.status !== 'RESOLVED').reduce((a, s) => a + s.riskReductionInr, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Inbox size={22} color="var(--accent-blue)" /> Remediation Queue
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          Track and action remediation work end-to-end, from assignment to resolution
        </p>
      </div>

      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard title="Open Items" value={scenarios.filter((s) => s.status !== 'RESOLVED').length} accentColor="#f97316" icon={<Inbox size={16} />} />
        <KPICard title="In Progress" value={scenarios.filter((s) => s.status === 'IN_PROGRESS').length} accentColor="#06b6d4" icon={<Inbox size={16} />} />
        <KPICard title="Resolved" value={scenarios.filter((s) => s.status === 'RESOLVED').length} accentColor="#22c55e" icon={<CheckCircle2 size={16} />} />
        <KPICard title="Pending Risk Reduction" value={formatRupees(totalRiskReduction)} accentColor="#ef4444" icon={<Inbox size={16} />} />
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Priority</th>
              <th>Affected Resource</th>
              <th>Effort</th>
              <th>Risk Reduction</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.id}>
                <td style={{ maxWidth: 260 }}>
                  <div style={{ fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{s.finding}</div>
                </td>
                <td>
                  <SeverityBadge severity={s.priority} />
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{s.affectedResource}</td>
                <td>{s.estimatedEffort}</td>
                <td style={{ color: 'var(--sev-low)', fontWeight: 700 }}>{formatRupees(s.riskReductionInr)}</td>
                <td>{s.owner?.name ?? '—'}</td>
                <td>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: STATUS_COLOR[s.status] }}>{STATUS_LABEL[s.status]}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {s.status === 'NOT_STARTED' && (
                      <button className="icon-btn" title="Assign" onClick={() => assign(s)}>
                        <UserPlus size={13} />
                      </button>
                    )}
                    {s.repository && s.status !== 'RESOLVED' && (
                      <button className="icon-btn" title="Create Pull Request" onClick={() => setPrTarget(s)}>
                        <GitPullRequest size={13} />
                      </button>
                    )}
                    {s.status !== 'RESOLVED' && (
                      <button className="icon-btn" title="Mark Resolved" onClick={() => markResolved(s)}>
                        <CheckCircle2 size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {prTarget && (
        <OpenPrModal
          open={!!prTarget}
          onClose={() => {
            updateStatus(prTarget.id, 'PR_OPENED');
            setPrTarget(null);
          }}
          repository={prTarget.repository ?? 'codesmiths/unknown'}
          branch={prTarget.branch ?? 'main'}
          packageName="requests"
          targetVersion="2.32.0"
          resourceLabel={prTarget.affectedResource}
        />
      )}
    </div>
  );
}
