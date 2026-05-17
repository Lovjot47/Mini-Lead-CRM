import { NavLink, Outlet } from 'react-router-dom';
import { LayoutList, Kanban, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { ToastContainer } from '@/components/ui/Toast';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-surface-200 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-surface-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-surface-900 tracking-tight">LeadFlow</span>
              <span className="block text-xs text-surface-400 leading-none">CRM</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/leads"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              )
            }
          >
            <LayoutList className="w-4 h-4" />
            Leads
          </NavLink>
          <NavLink
            to="/board"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              )
            }
          >
            <Kanban className="w-4 h-4" />
            Board
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-surface-100">
          <p className="text-xs text-surface-400">Superleap Assessment</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
}