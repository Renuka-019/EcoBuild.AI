import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import { User, Shield, Building2, CheckCircle2, AlertCircle, Key, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [userType, setUserType] = useState(user?.user_type || 'Builder');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [userBuildings, setUserBuildings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setUserType(user.user_type);
    }
    api.getBuildings().then(setUserBuildings).catch(() => {});
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    try {
      setSaving(true);
      const payload: any = { full_name: fullName, user_type: userType };
      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }
      await api.updateProfile(payload);
      await refreshUser();
      setCurrentPassword('');
      setNewPassword('');
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-5xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            Account Management
          </span>
          <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
            User Profile & Settings
          </h1>
          <p className="text-xs text-ink2/70 font-sans mt-0.5">
            Manage your account credentials, primary role, and registered buildings.
          </p>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-sans ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emeraldGreen" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left summary card */}
          <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-lime/20 border-2 border-lime text-forest text-3xl font-bold font-mono mx-auto flex items-center justify-center shadow-md">
                {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink font-sans">{user?.full_name}</h3>
                <span className="text-xs text-ink2/60 font-mono block">{user?.email}</span>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-forest text-lime text-[10px] font-mono font-bold uppercase tracking-wider">
                  {user?.user_type} {user?.is_admin && '• Admin'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-ink/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-ink2/70">
                <span>Total Buildings:</span>
                <span className="font-bold text-ink">{userBuildings.length}</span>
              </div>
              <div className="flex justify-between text-ink2/70">
                <span>Account Status:</span>
                <span className="text-emeraldGreen font-bold">Active</span>
              </div>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full py-2.5 px-4 rounded-xl bg-mist hover:bg-rose-50 hover:text-rose-700 text-ink text-xs font-medium font-mono transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Right Edit Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-ink/10 shadow-sm">
            <h3 className="text-lg font-bold text-ink font-sans mb-6">Edit Profile Details</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                    Role / User Type
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink font-sans"
                  >
                    <option value="Builder">Builder</option>
                    <option value="Architect">Architect</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/5 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  Change Password (Leave blank to keep existing)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-ink2/70 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-paper border border-ink/10 text-sm text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-ink2/70 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-paper border border-ink/10 text-sm text-ink"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 rounded-xl bg-ink text-paper hover:bg-forest font-semibold text-xs font-mono uppercase tracking-wider transition-all border border-lime/30"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>

            </form>
          </div>

        </div>

      </main>
    </div>
  );
};
