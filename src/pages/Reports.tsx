import { useEffect, useState } from 'react';
import { ScrollText, Download, Plus } from 'lucide-react';
import { getReports } from '../lib/api';
import { toast } from '../lib/toastStore';
import { SkeletonTable } from '../components/common/Skeleton';

interface ReportItem {
  id: string;
  name: string;
  generated: string;
  format: string;
}

export default function Reports() {
  const [reports, setReports] = useState<ReportItem[] | null>(null);

  useEffect(() => {
    getReports().then((r) => setReports(r as ReportItem[]));
  }, []);

  const generateNew = () => {
    toast.info('Generating report…');
    setTimeout(() => {
      const newReport: ReportItem = {
        id: `rep-${Date.now()}`,
        name: 'Ad-hoc Security Posture Snapshot',
        generated: new Date().toISOString().slice(0, 10),
        format: 'PDF',
      };
      setReports((prev) => [newReport, ...(prev ?? [])]);
      toast.success('Report generated', newReport.name);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScrollText size={22} color="var(--accent-blue)" /> Reports
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Board-ready and compliance reports generated from live risk data
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={generateNew}>
          <Plus size={14} /> Generate Report
        </button>
      </div>

      <div className="card">
        {!reports ? (
          <SkeletonTable rows={4} cols={3} />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Generated</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.generated}</td>
                  <td>{r.format}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => toast.success('Download started', `${r.name}.${r.format.toLowerCase()}`)}
                    >
                      <Download size={12} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
