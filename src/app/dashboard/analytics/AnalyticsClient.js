'use client';

import Sidebar from '../components/Sidebar';
import { MonthlyChart, CategoryChart, DailyChart } from '../components/Charts';
import { CATEGORIES } from '../../../lib/actions';
import { format } from 'date-fns';

export default function AnalyticsClient({ user, categoryData, monthlyData, dailyData, topExpenses, totalThisMonth, monthlyBudget }) {

  const getCategoryInfo = (categoryValue) => {
    return CATEGORIES.find((c) => c.value === categoryValue) || CATEGORIES[CATEGORIES.length - 1];
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar user={user} currentPath="/dashboard/analytics" />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Deep dive into your spending patterns</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">This Month</p>
              <p className="text-xl lg:text-2xl font-bold text-white mt-1">
                ${totalThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
              <p className="text-xl lg:text-2xl font-bold text-white mt-1">
                {monthlyBudget > 0 ? `$${monthlyBudget.toLocaleString()}` : 'Not set'}
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Categories</p>
              <p className="text-xl lg:text-2xl font-bold text-white mt-1">{categoryData.length}</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Avg/Day</p>
              <p className="text-xl lg:text-2xl font-bold text-white mt-1">
                ${(totalThisMonth / new Date().getDate()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <MonthlyChart data={monthlyData} />
            <CategoryChart data={categoryData} />
          </div>

          <div className="mt-4 lg:mt-6">
            <DailyChart data={dailyData} />
          </div>

          {/* Top Expenses */}
          <div className="mt-4 lg:mt-6 glass-card rounded-2xl p-5 lg:p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-1">Top Expenses</h3>
            <p className="text-sm text-gray-500 mb-4">Your biggest spending items</p>

            {topExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
            ) : (
              <div className="space-y-3">
                {topExpenses.map((expense, index) => {
                  const cat = getCategoryInfo(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-sm font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{expense.item_name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(expense.date + 'T00:00:00'), 'MMM dd, yyyy')} · {cat.label}
                        </p>
                      </div>
                      <p className="text-base font-semibold text-white">
                        ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
