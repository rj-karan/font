import { useEffect, useState } from 'react';
import { Plug, RefreshCw, Settings2, Power, PlugZap } from 'lucide-react';
import { INTEGRATIONS } from '../demo/fixtures';
import IntegrationLogo from '../components/common/IntegrationLogo';
import { toast } from '../lib/toastStore';
import type { Integration, IntegrationStatus } from '../types';

const STATUS_COLOR: Record<IntegrationStatus, string> = {
  connected: '#22c55e',
  disconnected: '#8b949e',
  connecting: '#06b6d4',
  error: '#ef4444',
  syncing: '#2563eb',
};

const STATUS_LABEL: Record<IntegrationStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  connecting: 'Connecting…',
  error: 'Error',
  syncing: 'Syncing…',
};

export default function Integrations() {
  const [items, setItems] = useState<Integration[]>(INTEGRATIONS.map((i) => ({ ...i })));

  useEffect(() => {
    // Simulate any items in 'connecting' state resolving to 'connected' after a delay.
    const connecting = items.filter((i) => i.status === 'connecting');
    if (connecting.length === 0) return;
    const timer = setTimeout(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.status === 'connecting'
            ? { ...i, status: 'connected', lastSync: new Date().toISOString(), itemsIngested: Math.floor(Math.random() * 40) + 5 }
            : i
        )
      );
      connecting.forEach((i) => toast.success(`${i.name} connected`, 'Initial sync completed successfully.'));
    }, 1800);
    return () => clearTimeout(timer);
  }, [items]);

  const connect = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'connecting' } : i)));
    toast.info('Connecting…', 'Establishing a secure connection and requesting scopes.');
  };

  const reconnect = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'syncing' } : i)));
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'connected', lastSync: new Date().toISOString() } : i)));
      toast.success('Reconnected', 'Sync completed successfully.');
    }, 1400);
  };

  const disable = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'disconnected', itemsIngested: 0 } : i)));
    toast.warning('Integration disabled', 'Ingestion has been paused for this source.');
  };

  const testConnection = (name: string) => {
    toast.info('Testing connection…');
    setTimeout(() => toast.success('Connection healthy', `${name} responded in 214ms.`), 1000);
  };

  const connectedCount = items.filter((i) => i.status === 'connected' || i.status === 'syncing').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Plug size={22} color="var(--accent-blue)" /> Integrations
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          {connectedCount} of {items.length} sources connected · manage ingestion across code, cloud, identity, and threat intelligence
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {items.map((integration) => (
          <div key={integration.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <IntegrationLogo integrationKey={integration.key} size={32} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{integration.name}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', textTransform: 'capitalize' }}>{integration.category.replace('_', ' ')}</div>
                </div>
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: STATUS_COLOR[integration.status],
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[integration.status] }} />
                {STATUS_LABEL[integration.status]}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minHeight: 36, lineHeight: 1.5 }}>{integration.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-subtle)', marginBottom: 12 }}>
              <span>{integration.itemsIngested} items ingested</span>
              {integration.errors > 0 && <span style={{ color: 'var(--sev-medium)' }}>{integration.errors} error(s)</span>}
              {integration.lastSync && <span>Synced {new Date(integration.lastSync).toLocaleTimeString()}</span>}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {integration.status === 'disconnected' && (
                <button className="btn-primary" style={{ padding: '6px 10px', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => connect(integration.id)}>
                  <PlugZap size={12} /> Connect
                </button>
              )}
              {(integration.status === 'connected' || integration.status === 'error') && (
                <>
                  <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => reconnect(integration.id)}>
                    <RefreshCw size={12} /> Reconnect
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.6875rem' }} onClick={() => testConnection(integration.name)}>
                    Test
                  </button>
                  <button className="icon-btn" title="Configure" onClick={() => toast.info(`Configure ${integration.name}`, 'Configuration panel would open here.')}>
                    <Settings2 size={13} />
                  </button>
                  <button className="icon-btn" title="Disable" onClick={() => disable(integration.id)}>
                    <Power size={13} />
                  </button>
                </>
              )}
              {(integration.status === 'connecting' || integration.status === 'syncing') && (
                <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: 4 }} disabled>
                  <RefreshCw size={12} style={{ animation: 'spin-refresh 0.8s linear infinite' }} /> {integration.status === 'connecting' ? 'Connecting' : 'Syncing'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
