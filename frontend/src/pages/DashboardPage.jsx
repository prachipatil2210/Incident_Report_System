import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardPage({ token }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError('Could not load reports.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // In a real app, we might want a WebSocket or polling for "live" updates
    const intervalId = setInterval(fetchReports, 10000); // poll every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Optimistically update UI
      setReports(reports.map(report => 
        report.id === id ? { ...report, status: newStatus } : report
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const newReports = reports.filter(r => r.status === 'New').length;
    const investigating = reports.filter(r => r.status === 'Under Investigation').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const urgent = reports.filter(r => r.isUrgent).length;
    
    // Data for analytics chart (Reports by Type)
    const typeCounts = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {});
    
    const chartData = Object.keys(typeCounts).map(key => ({
      name: key,
      count: typeCounts[key]
    })).sort((a, b) => b.count - a.count);

    return { total, newReports, investigating, resolved, urgent, chartData };
  }, [reports]);

  const colors = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'badge-new';
      case 'Under Investigation': return 'badge-investigating';
      case 'Resolved': return 'badge-resolved';
      default: return '';
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Dashboard...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-main)' }}>Security Dashboard</h1>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="stats-container">
        <div className="glass-panel stat-card">
          <div className="stat-label">Total Reports</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-label" style={{ color: 'var(--danger)' }}>Urgent</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.urgent}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-label" style={{ color: '#ef4444' }}>New</div>
          <div className="stat-value">{stats.newReports}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-label" style={{ color: 'var(--warning)' }}>Investigating</div>
          <div className="stat-value">{stats.investigating}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-label" style={{ color: 'var(--success)' }}>Resolved</div>
          <div className="stat-value">{stats.resolved}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Live Feed</h2>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  reports.map(report => (
                    <tr key={report.id}>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                          {report.status}
                        </span>
                        {report.isUrgent === 1 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <span className="urgent-indicator"><AlertTriangle size={14} /> URGENT</span>
                          </div>
                        )}
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: 600 }}>{report.type}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {report.description}
                        </div>
                        {report.photoUrl && (
                          <a href={report.photoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textDecoration: 'underline' }}>View Photo</a>
                        )}
                      </td>
                      <td>{report.location}</td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {new Date(report.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <select 
                          className="status-select"
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Under Investigation">Investigating</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Analytics: Reports by Type</h2>
          
          <div style={{ height: '300px', width: '100%' }}>
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No data to display.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
