'use client';

import { createClient } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  HiOutlineViewGrid,
  HiOutlineChartPie,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlinePlusCircle,
} from 'react-icons/hi';

export default function Sidebar({ user, currentPath, onAddExpense }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { href: '/dashboard/analytics', icon: HiOutlineChartPie, label: 'Analytics' },
    { href: '/dashboard/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-dark-600/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">ExpenseFlow</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Tracker</p>
          </div>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="p-4">
        <button
          onClick={() => {
            onAddExpense?.();
            setMobileOpen(false);
          }}
          className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-accent-primary' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="p-4 border-t border-dark-600/50">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-sm font-bold">
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-red-400 
                     hover:bg-red-500/5 rounded-xl transition-all duration-200 text-sm"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-dark-700 rounded-xl border border-dark-500 text-gray-300 hover:text-white transition-colors"
      >
        <HiOutlineMenuAlt2 className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-dark-800 border-r border-dark-600/50">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-dark-800 shadow-2xl animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
