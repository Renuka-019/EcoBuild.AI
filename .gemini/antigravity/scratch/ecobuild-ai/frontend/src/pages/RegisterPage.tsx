import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Builder');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await register({
        full_name: fullName,
        email,
        password,
        user_type: userType
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
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
          Create Your Free Account
        </h2>
        <p className="text-xs text-ink2/70 font-sans">
          Join thousands of architects and builders creating measurable sustainable designs.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="sarah@architecture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                User Type / Role
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink font-sans"
              >
                <option value="Builder">Builder / Contractor</option>
                <option value="Architect">Architect</option>
                <option value="Engineer">Structural / Civil Engineer</option>
                <option value="Student">Engineering / Architecture Student</option>
                <option value="Other">Other Construction Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink2/80 mb-1.5 font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:ring-2 focus:ring-lime2 focus:outline-none text-sm text-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-ink text-paper hover:bg-forest font-semibold text-sm transition-all border border-lime/30 shadow-md flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? 'Creating Account...' : 'Register for EcoBuild AI'}
              <ArrowRight className="w-4 h-4 text-lime transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-ink2/70 font-sans border-t border-ink/5">
            Already have an account?{' '}
            <Link to="/login" className="text-emeraldGreen font-semibold hover:underline">
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
