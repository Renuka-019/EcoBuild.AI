import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Building2,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  Edit2,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingFactorId, setEditingFactorId] = useState<number | null>(null);
  const [newFactorVal, setNewFactorVal] = useState<number>(0);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId: number) => {
    try {
      await api.toggleUserStatus(userId);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleUpdateFactor = async (factorId: number) => {
    try {
      await api.updateEmissionFactor(factorId, newFactorVal);
      setEditingFactorId(null);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update emission factor');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] bg-paper">
        <AppSidebar />
        <main className="flex-1 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-ink">Administrative Access Restricted</h2>
          <p className="text-xs text-ink2/70 max-w-sm mx-auto">
            This module requires system administrator privileges. Please log in with an authorized administrator account.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lime bg-ink px-2.5 py-1 rounded inline-block font-semibold mb-2">
            Restricted System Console
          </span>
          <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
            Platform Administration & Emission Factors
          </h1>
          <p className="text-xs text-ink2/70 font-sans mt-0.5">
            Manage user accounts, inspect system activity logs, and configure governing carbon & material emission factors.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-mono text-ink2/60 mt-3">Loading administrative console...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-1">
                <span className="text-xs font-mono uppercase text-ink2/60">Registered Users</span>
                <div className="text-3xl font-extrabold font-mono text-ink">{data?.stats?.total_users || 0}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-1">
                <span className="text-xs font-mono uppercase text-ink2/60">Total Buildings</span>
                <div className="text-3xl font-extrabold font-mono text-forest">{data?.stats?.total_buildings || 0}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-1">
                <span className="text-xs font-mono uppercase text-ink2/60">Total AI Analyses</span>
                <div className="text-3xl font-extrabold font-mono text-emeraldGreen">{data?.stats?.total_analyses || 0}</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-1">
                <span className="text-xs font-mono uppercase text-ink2/60">Solutions in Library</span>
                <div className="text-3xl font-extrabold font-mono text-ink">{data?.stats?.total_solutions || 0}</div>
              </div>
            </div>

            {/* Emission Factors Manager Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4 overflow-x-auto">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  Scientific Calibration
                </span>
                <h3 className="text-lg font-bold text-ink font-sans">
                  Governing Emission Factors (Live Update Engine)
                </h3>
              </div>

              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-ink/10 font-mono text-[11px] text-ink2/60 uppercase">
                    <th className="py-3 px-4">Factor Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Value</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Source & Year</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {data?.emission_factors?.map((f: any) => (
                    <tr key={f.id}>
                      <td className="py-3 px-4 font-semibold text-ink">{f.name}</td>
                      <td className="py-3 px-4 font-mono text-ink2/70">{f.category}</td>
                      <td className="py-3 px-4 font-mono font-bold text-forest">
                        {editingFactorId === f.id ? (
                          <input
                            type="number"
                            step="0.001"
                            value={newFactorVal}
                            onChange={(e) => setNewFactorVal(Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded bg-paper border border-ink/20 font-mono text-xs"
                          />
                        ) : (
                          f.factor_value
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-ink2/60">{f.unit}</td>
                      <td className="py-3 px-4 text-ink2/70">{f.source} ({f.source_year})</td>
                      <td className="py-3 px-4">
                        {editingFactorId === f.id ? (
                          <button
                            onClick={() => handleUpdateFactor(f.id)}
                            className="px-3 py-1 rounded-lg bg-forest text-lime font-mono text-[11px] font-bold"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => { setEditingFactorId(f.id); setNewFactorVal(f.factor_value); }}
                            className="p-1 rounded text-ink2/50 hover:text-ink transition-colors"
                            title="Edit Factor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* User Management Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4 overflow-x-auto">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  User Accounts
                </span>
                <h3 className="text-lg font-bold text-ink font-sans">
                  Registered Platform Users
                </h3>
              </div>

              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-ink/10 font-mono text-[11px] text-ink2/60 uppercase">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Buildings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {data?.users?.map((u: any) => (
                    <tr key={u.id}>
                      <td className="py-3 px-4 font-semibold text-ink">{u.full_name}</td>
                      <td className="py-3 px-4 font-mono text-ink2/70">{u.email}</td>
                      <td className="py-3 px-4 font-mono">{u.user_type} {u.is_admin && '★'}</td>
                      <td className="py-3 px-4 font-mono">{u.buildings_count}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className="text-[11px] font-mono text-ink hover:underline"
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* System Audit Activity Logs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  Security & Audit Log
                </span>
                <h3 className="text-lg font-bold text-ink font-sans">
                  Recent Platform Operations
                </h3>
              </div>

              <div className="space-y-2">
                {data?.recent_activity?.map((log: any) => (
                  <div key={log.id} className="p-3 rounded-xl bg-paper flex items-center justify-between text-xs font-mono text-ink2/80">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{log.action}:</span>
                      <span>{log.details}</span>
                    </div>
                    <div className="text-[10px] text-ink2/50 shrink-0">
                      User: {log.user} • {new Date(log.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
