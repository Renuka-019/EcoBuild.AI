import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  BarChart3,
  Sliders,
  DollarSign,
  FileText,
  Compass,
  Library,
  GraduationCap,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const primaryLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Buildings', path: '/buildings', icon: Building2 },
    { label: 'Add Building', path: '/buildings/new', icon: PlusCircle },
    { label: 'Design Comparison', path: '/compare', icon: BarChart3 },
    { label: 'Green Simulator', path: '/simulator', icon: Sliders },
    { label: 'Cost & Savings', path: '/cost-savings', icon: DollarSign },
    { label: 'Audit Reports', path: '/reports', icon: FileText },
  ];

  const exploreLinks = [
    { label: 'Benchmark Explorer', path: '/benchmarks', icon: Compass },
    { label: 'Solutions Library', path: '/solutions', icon: Library },
    { label: 'Knowledge Hub', path: '/knowledge-hub', icon: GraduationCap },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-ink text-paper shrink-0 border-r border-line/10 hidden md:flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* User Welcome Chip */}
      <div className="p-5 border-b border-white/10 bg-forest/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime/20 border border-lime/40 text-lime font-bold flex items-center justify-center font-mono">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h5 className="text-sm font-semibold text-paper truncate">{user?.full_name}</h5>
            <span className="text-[11px] font-mono text-lime2 block uppercase tracking-wide">
              {user?.user_type || 'Builder'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-paper/40 px-3 block mb-2 font-semibold">
            Workspace
          </span>
          <nav className="space-y-1">
            {primaryLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-lime text-ink font-semibold shadow-sm'
                      : 'text-paper/75 hover:bg-white/5 hover:text-paper'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-paper/40 px-3 block mb-2 font-semibold">
            Intelligence & Resources
          </span>
          <nav className="space-y-1">
            {exploreLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-lime text-ink font-semibold'
                      : 'text-paper/75 hover:bg-white/5 hover:text-paper'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border border-lime2/40 ${
                    isActive
                      ? 'bg-lime text-ink font-bold'
                      : 'text-lime hover:bg-lime/10'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="p-4 border-t border-white/10 text-[11px] font-mono text-paper/40 flex items-center justify-between">
        <span>ISO 14040 Engine</span>
        <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
      </div>

    </aside>
  );
};
