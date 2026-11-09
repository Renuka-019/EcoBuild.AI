import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, ArrowRight, LayoutDashboard, Building2, User, LogOut, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Knowledge Hub', path: '/knowledge-hub' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F6F7F4]/90 backdrop-blur-md border-b border-[#10291A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-ink text-lime flex items-center justify-center shadow-md transition-transform group-hover:scale-105 border border-lime/30">
            <Leaf className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-ink font-sans">
                EcoBuild<span className="text-lime2">.ai</span>
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink2/70 -mt-0.5">
              Build Smarter. Build Greener.
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-ink font-semibold' : 'text-ink2/80 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-paper hover:bg-forest text-sm font-medium shadow-sm transition-all border border-lime/30"
              >
                <LayoutDashboard className="w-4 h-4 text-lime" />
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-lime/20 text-ink border border-lime2 text-xs font-mono font-medium hover:bg-lime/30 transition-all"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-ink2" />
                  Admin
                </Link>
              )}

              <Link
                to="/profile"
                className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center text-ink hover:bg-white border border-ink/10 transition-colors"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center text-ink2 hover:text-red-600 hover:bg-red-50 border border-ink/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-ink2 hover:text-ink px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest text-sm font-semibold shadow-sm transition-all border border-lime/30 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 text-lime transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-ink hover:bg-mist transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-paper border-b border-ink/10 px-6 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-base font-medium text-ink2 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-ink/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-ink text-paper font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full text-center py-2 text-sm text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-ink font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-ink text-paper font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
