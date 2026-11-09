import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ArrowRight, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login({ email, password, remember_me: rememberMe });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (type: 'demo' | 'admin') => {
    if (type === 'demo') {
      setEmail('demo@ecobuild.ai');
      setPassword('DemoPass123!');
    } else {
      setEmail('admin@ecobuild.ai');
      setPassword('AdminPass123!');
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-ink text-lime flex items-center justify-center border border-lime/30">
            <Leaf className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-ink font-sans">
            EcoBuild<span className="text-lime2">.ai</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-ink2/70 font-sans">
          Access your saved building designs, simulation models, and environmental reports.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-ink/10 shadow-xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 rounded-2xl bg-mist/60 border border-ink/10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink2/70 font-semibold block text-center">
              Quick 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('demo')}
                className="py-1.5 px-2 rounded-lg bg-white border border-ink/10 text-xs font-mono font-medium text-ink hover:bg-lime/20 hover:border-lime2 transition-colors flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-forest" />
                Demo Architect
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 rounded-lg bg-white border border-ink/10 text-xs font-mono font-medium text-ink hover:bg-lime/20 hover:border-lime2 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                System Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 font-semibold">
                  Password
                </label>
                <span className="text-xs text-ink2/60 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-ink/20 text-forest focus:ring-lime2"
                />
                <span className="text-ink2/80">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-ink text-paper hover:bg-forest font-semibold text-sm transition-all border border-lime/30 shadow-md flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 text-lime transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-ink2/70 font-sans border-t border-ink/5">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emeraldGreen font-semibold hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
