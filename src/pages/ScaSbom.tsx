import { useMemo, useState } from 'react';
import { Package, Gitlab } from 'lucide-react';
import SeverityBadge from '../components/common/SeverityBadge';
import KPICard from '../components/common/KPICard';
import { REPOSITORIES, SCA_FINDINGS } from '../demo/fixtures';
import { toast } from '../lib/toastStore';

export default function ScaSbom() {
  const [activeRepo, setActiveRepo] = useState(REPOSITORIES[1].name); // payments-service by default
  const [runtimeOnly, setRuntimeOnly] = useState(false);

  const findings = useMemo(
    () => SCA_FINDINGS.filter((f) => f.repository === activeRepo && (!runtimeOnly || f.reachable)),
    [activeRepo, runtimeOnly]
  );

  const repo = REPOSITORIES.find((r) => r.name === activeRepo);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Package size={22} color="var(--sev-low)" /> SCA & SBOM
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem', maxWidth: 640 }}>
          Gain visibility into every software component. Detect vulnerabilities in direct and transitive
          dependencies and prioritize the reachable ones with runtime context from the CRISPR sensor.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {REPOSITORIES.map((r) => (
          <button
            key={r.id}
            className="chip"
            onClick={() => setActiveRepo(r.name)}
            style={{ borderColor: activeRepo === r.name ? 'var(--accent-blue)' : 'var(--bg-border)', color: activeRepo === r.name ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard title="Dependency Count" value={repo?.dependencies ?? 0} accentColor="#2563eb" icon={<Package size={16} />} />
        <KPICard title="Vulnerable Dependencies" value={findings.length} accentColor="#f97316" icon={<Package size={16} />} />
        <KPICard title="Critical Dependencies" value={findings.filter((f) => f.severity === 'CRITICAL').length} accentColor="#ef4444" icon={<Package size={16} />} />
        <KPICard title="Reachable Vulnerabilities" value={findings.filter((f) => f.reachable).length} accentColor="#7c3aed" icon={<Package size={16} />} />
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Gitlab size={18} color="var(--text-muted)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9375rem' }}>{activeRepo}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{repo?.provider === 'gitlab' ? 'GitLab Project' : 'GitHub Repository'}</div>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={runtimeOnly} onChange={(e) => setRuntimeOnly(e.target.checked)} />
            Validated in Runtime
          </label>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Finding</th>
              <th>Severity</th>
              <th>Component</th>
              <th>Version</th>
              <th>Fixed Version</th>
              <th>Reachable</th>
              <th>Exploit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr key={f.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{f.cve}</td>
                <td>
                  <SeverityBadge severity={f.severity} />
                </td>
                <td>{f.component}</td>
                <td style={{ color: 'var(--text-muted)' }}>{f.version}</td>
                <td style={{ color: 'var(--sev-low)', fontWeight: 600 }}>{f.fixedVersion ?? '—'}</td>
                <td>{f.reachable ? <span style={{ color: 'var(--sev-critical)', fontWeight: 700 }}>Yes</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}</td>
                <td>{f.exploitAvailable ? <span style={{ color: 'var(--sev-critical)', fontWeight: 700 }}>Yes</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}</td>
                <td>{f.status.replace('_', ' ')}</td>
                <td>
                  <button
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.6875rem' }}
                    onClick={() => toast.success('Pull request opened', `Upgrade ${f.component} to ${f.fixedVersion} on ${activeRepo}.`)}
                  >
                    Open PR
                  </button>
                </td>
              </tr>
            ))}
            {findings.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">No vulnerability findings for the selected filters.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
