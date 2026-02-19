'use client';

import { useState, useTransition } from 'react';
import Sidebar from '../components/Sidebar';
import { updateBudget } from '../../../lib/actions';
import { HiOutlineCurrencyDollar, HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function SettingsClient({ user, settings }) {
  const [budget, setBudget] = useState(settings?.monthly_budget || '');
  const [isPending, startTransition] = useTransition();

  const handleSaveBudget = () => {
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    startTransition(async () => {
      const result = await updateBudget(budgetValue);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Budget updated successfully!');
      }
    });
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar user={user} currentPath="/dashboard/settings" />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Manage your account and preferences</p>
          </div>

          {/* Profile Section */}
          <div className="glass-card rounded-2xl p-5 lg:p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HiOutlineUser className="w-5 h-5 text-accent-primary" />
              Profile Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-xl font-bold">
                  {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-base font-medium text-white">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <HiOutlineMail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                <HiOutlineShieldCheck className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400">
                  Authenticated via {user?.app_metadata?.provider || 'OAuth'}
                </p>
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="glass-card rounded-2xl p-5 lg:p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HiOutlineCurrencyDollar className="w-5 h-5 text-accent-success" />
              Monthly Budget
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Set your monthly spending limit. You&apos;ll see progress tracking on your dashboard.
            </p>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 2000"
                  min="0"
                  step="50"
                  className="input-field pl-8"
                />
              </div>
              <button
                onClick={handleSaveBudget}
                disabled={isPending}
                className="btn-primary whitespace-nowrap"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Budget'
                )}
              </button>
            </div>

            {/* Budget presets */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[500, 1000, 1500, 2000, 3000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudget(amount)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-card rounded-2xl p-5 lg:p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Data & Privacy</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your data is securely stored in Supabase with Row Level Security enabled. 
              Only you can access your expense data.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-200">Data Encryption</p>
                  <p className="text-xs text-gray-500">All data encrypted at rest and in transit</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-200">Row Level Security</p>
                  <p className="text-xs text-gray-500">Database policies protect your data</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-full">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
