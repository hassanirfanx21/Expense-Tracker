'use client';

import { HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCalendar } from 'react-icons/hi';

export default function SummaryCards({ totalSpent, monthlyBudget, totalThisMonth, totalLastMonth, expenseCount }) {
  const budgetPercentage = monthlyBudget > 0 ? ((totalThisMonth / monthlyBudget) * 100) : 0;
  const budgetRemaining = monthlyBudget > 0 ? monthlyBudget - totalThisMonth : 0;
  const monthChange = totalLastMonth > 0 ? (((totalThisMonth - totalLastMonth) / totalLastMonth) * 100) : 0;

  const cards = [
    {
      title: 'Total Spent',
      value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${expenseCount} transactions`,
      icon: HiOutlineCurrencyDollar,
      iconBg: 'from-indigo-500 to-purple-500',
      iconColor: 'text-white',
    },
    {
      title: 'This Month',
      value: `$${totalThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: monthChange !== 0
        ? `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}% vs last month`
        : 'No comparison data',
      icon: HiOutlineCalendar,
      iconBg: 'from-blue-500 to-cyan-500',
      iconColor: 'text-white',
      trend: monthChange,
    },
    {
      title: 'Budget Used',
      value: monthlyBudget > 0
        ? `${budgetPercentage.toFixed(1)}%`
        : 'Not set',
      subtitle: monthlyBudget > 0
        ? `$${budgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining`
        : 'Set in Settings',
      icon: HiOutlineTrendingUp,
      iconBg: budgetPercentage > 90 ? 'from-red-500 to-orange-500' : budgetPercentage > 70 ? 'from-yellow-500 to-orange-500' : 'from-emerald-500 to-teal-500',
      iconColor: 'text-white',
      progress: monthlyBudget > 0 ? budgetPercentage : null,
    },
    {
      title: 'Daily Average',
      value: `$${(totalThisMonth / new Date().getDate()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'This month',
      icon: HiOutlineTrendingDown,
      iconBg: 'from-pink-500 to-rose-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="glass-card rounded-2xl p-5 lg:p-6 hover:shadow-glow transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            {card.trend !== undefined && card.trend !== 0 && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                card.trend > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
              }`}>
                {card.trend > 0 ? '↑' : '↓'} {Math.abs(card.trend).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-1">{card.title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{card.value}</p>
          <p className="text-xs text-gray-500">{card.subtitle}</p>

          {/* Budget progress bar */}
          {card.progress !== null && card.progress !== undefined && (
            <div className="mt-3">
              <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    card.progress > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                    card.progress > 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
