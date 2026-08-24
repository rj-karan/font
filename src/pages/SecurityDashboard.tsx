import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Radio, Target, Globe, Boxes, Inbox, IndianRupee } from 'lucide-react';
import KPICard from '../components/common/KPICard';
import RiskScoreBadge from '../components/common/RiskScoreBadge';
import ProgressBar from '../components/common/ProgressBar';
import SourceStatusDot from '../components/common/SourceStatusDot';
import SourcePill from '../components/common/SourcePill';
import RiskDonut from '../components/charts/RiskDonut';
import InteractiveTrendChart from '../components/charts/InteractiveTrendChart';
import AIAdvisorChat from '../components/common/AIAdvisorChat';
import RiskPostureCard from '../components/dashboard/RiskPostureCard';
import FindingsSummary from '../components/dashboard/FindingsSummary';
import SecurityPipeline from '../components/dashboard/SecurityPipeline';
import RiskCaseDrawer from '../components/riskcases/RiskCaseDrawer';
import { getEnterprise, getRiskCases, getSources, getFindings } from '../lib/api';
import { MULTI_SERIES_TREND } from '../demo/fixtures';
import { useDemoStore } from '../demo/demoStore';
import { useUiStore, setFilter } from '../lib/uiStore';
import { formatLakh, sourceColor, sourceLabel } from '../utils/format';
import { activateOnEnter } from '../utils/a11y';
import type { Finding, RiskCase } from '../types';
import { SkeletonCard } from '../components/common/Skeleton';

const SECURITY_SUGGESTIONS = [
  'What is our top security risk?',
  'Why is Auth API high risk?',
  'Which CVEs are exploited in the wild?',
  'What if we implement MFA?',
];

const TREND_SERIES = [
  { key: 'enterpriseRisk', label: 'Enterprise Risk', color: '#ef4444' },
  { key: 'criticalFindings', label: 'Critical Findings', color: '#f97316' },
  { key: 'exposedAssets', label: 'Exposed Assets', color: '#7c3aed' },
  { key: 'remediationProgress', label: 'Remediation Progress', color: '#22c55e' },
];

export default function SecurityDashboard() {
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<any>(null);
  const [risks, setRisks] = useState<RiskCase[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [activeCase, setActiveCase] = useState<RiskCase | null>(null);

  const riskScore = useDemoStore((s) => s.riskScore);
  const previousRiskScore = useDemoStore((s) => s.previousRiskScore);
  const isRunning = useDemoStore((s) => s.isRunning);
  const filters = useUiStore((s) => s.filters);

  useEffect(() => {
    Promise.all([getEnterprise(), getRiskCases(), getSources(), getFindings()]).then(([e, r, s, f]) => {
      setEnterprise(e);
      setRisks(r);
      setSources(s);
      setFindings(f);
    });
  }, []);

  const sortedRisks = useMemo(() => [...risks].sort((a, b) => b.risk_score - a.risk_score), [risks]);

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter((f) => f.severity === 'LOW').length;
  const connectedCount = sources.filter((s) => s.status === 'connected').length;
  const topRisk = sortedRisks[0];
  const internetExposed = risks.filter((r) => (r as any).exposure === 'INTERNET').length || 2;
  const openRemediations = 5;

  const findingsSummaryRows = [
    { severity: 'CRITICAL' as const, count: criticalCount, trendPct: 8, remediationRate: 25 },
    { severity: 'HIGH' as const, count: highCount, trendPct: 4, remediationRate: 40 },
    { severity: 'MEDIUM' as const, count: mediumCount, trendPct: -2, remediationRate: 60 },
    { severity: 'LOW' as const, count: lowCount, trendPct: -6, remediationRate: 80 },
  ];

  if (!enterprise) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard lines={5} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Security Operations</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem', maxWidth: 620 }}>
            Real-time security posture across infrastructure, applications, identities, repositories and cloud resources.
          </p>
        </div>
      </div>

      {/* Executive metric grid */}
      <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard
          title="Critical Findings"
          value={criticalCount}
          subtitle={`${highCount} HIGH · ${mediumCount} MEDIUM`}
          icon={<AlertTriangle size={16} />}
          accentColor="#ef4444"
          navigateTo="/findings?severity=CRITICAL"
          tooltip="Findings validated as CRITICAL severity across all connected sources."
          sparkline={[4, 5, 6, 7, 8, criticalCount]}
        />
        <KPICard
          title="Internet Exposed Assets"
          value={internetExposed}
          subtitle="Directly reachable from the internet"
          icon={<Globe size={16} />}
          accentColor="#f97316"
          navigateTo="/resources"
          tooltip="Assets with a public IP or internet-facing ingress rule."
        />
        <KPICard
          title="Sources Connected"
          value={`${connectedCount}/${sources.length}`}
          subtitle={`${sources.length - connectedCount} pending integration`}
          icon={<Radio size={16} />}
          accentColor="#2563eb"
          navigateTo="/integrations"
        />
        <KPICard
          title="Estimated Annual Loss"
          value={formatLakh(enterprise.total_eal_lakh)}
          subtitle="Total quantified cyber exposure"
          icon={<IndianRupee size={16} />}
          accentColor="#ef4444"
          navigateTo="/financial"
        />
        <KPICard
          title="Monitored Assets"
          value={13}
          subtitle="Across code, cloud, and identity"
          icon={<Boxes size={16} />}
          accentColor="#06b6d4"
          navigateTo="/assets"
        />
        <KPICard
          title="Active Risk Cases"
          value={risks.length}
          subtitle="Correlated across multiple sources"
          icon={<Target size={16} />}
          accentColor="#7c3aed"
          navigateTo="/risks"
        />
        <KPICard
          title="Open Remediations"
          value={openRemediations}
          subtitle="In the remediation queue"
          icon={<Inbox size={16} />}
          accentColor="#22c55e"
          navigateTo="/remediation-queue"
        />
        <KPICard
          title="Top Asset at Risk"
          value={topRisk?.asset_name?.split(' ').slice(0, 2).join(' ') ?? '—'}
          subtitle={`Risk score ${topRisk?.risk_score} · ${formatLakh(topRisk?.eal_lakh)} EAL`}
          icon={<ShieldAlert size={16} />}
          accentColor="#ef4444"
          navigateTo="/risks"
        />
      </div>

      {/* Risk posture + findings summary */}
      <div className="dashboard-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <RiskPostureCard
          score={riskScore}
          previousScore={previousRiskScore}
          ealLakh={enterprise.total_eal_lakh}
          onOpenDetail={() => topRisk && setActiveCase(topRisk)}
        />
        <div className="card">
          <div className="card-title">Findings by Severity</div>
          <FindingsSummary rows={findingsSummaryRows} />
        </div>
      </div>

      {/* Security pipeline */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div className="card-title" style={{ margin: 0 }}>
            Active Security Pipeline
          </div>
          {isRunning && <span style={{ fontSize: '0.6875rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>Analysis in progress…</span>}
        </div>
        <SecurityPipeline />
      </div>

      {/* Row: risk cases / findings by source / trend */}
      <div className="dashboard-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16 }}>
        {/* Active Risk Cases */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title" style={{ margin: 0 }}>
              Active Risk Cases
            </div>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.6875rem' }} onClick={() => navigate('/risks')}>
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 460, overflowY: 'auto', marginTop: 12 }}>
            {sortedRisks.map((r) => (
              <div
                key={r.asset_id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCase(r)}
                onKeyDown={activateOnEnter(() => setActiveCase(r))}
                style={{
                  border: '1px solid var(--bg-border)',
                  borderRadius: 8,
                  padding: 14,
                  background: 'var(--bg-elevated)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{r.asset_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.business_service}</div>
                  </div>
                  <RiskScoreBadge score={r.risk_score} size={40} />
                </div>
                <div style={{ margin: '10px 0' }}>
                  <ProgressBar value={r.confidence_pct ?? 80} color="#06b6d4" label="Confidence" />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {(r.sources ?? []).map((s) => (
                    <SourcePill key={s} source={s} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EAL: {formatLakh(r.eal_lakh)}</span>
                  <button
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.6875rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCase(r);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Findings by Source */}
          <div className="card">
            <div className="card-title">Findings by Source</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {sources.map((s) => (
                <div
                  key={s.source}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/findings`)}
                  onKeyDown={activateOnEnter(() => navigate('/findings'))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'var(--bg-elevated)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: sourceColor(s.source) }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{sourceLabel(s.source)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.count}</span>
                    <SourceStatusDot status={s.status} />
                  </div>
                </div>
              ))}
            </div>
            <RiskDonut data={sources} height={180} />
          </div>
        </div>
      </div>

      {/* Interactive Risk Trend */}
      <div className="card">
        <div className="card-title">Risk Trend</div>
        <InteractiveTrendChart
          data={MULTI_SERIES_TREND}
          xKey="month"
          series={TREND_SERIES}
          defaultSeries={['enterpriseRisk']}
          height={260}
          activeRange={filters.timeRange}
          onRangeChange={(r) => setFilter('timeRange', r as any)}
        />
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.12)',
            color: 'var(--sev-critical)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          ↑ 50% increase in enterprise risk since March — immediate action recommended
        </div>
      </div>

      {/* AI Advisor */}
      <AIAdvisorChat theme="security" suggestions={SECURITY_SUGGESTIONS} />

      <RiskCaseDrawer riskCase={activeCase} open={!!activeCase} onClose={() => setActiveCase(null)} />
    </div>
  );
}
