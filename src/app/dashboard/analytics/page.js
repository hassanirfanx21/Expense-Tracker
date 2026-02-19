import { createServerSupabaseClient } from '../../../lib/supabase-server';
import { redirect } from 'next/navigation';
import { getSpendingByCategory, getMonthlySpending, getDailySpending, getExpenses, getTotalSpent, getUserSettings } from '../../../lib/actions';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [categoryData, monthlyData, dailyData, expenses, totalThisMonth, settings] = await Promise.all([
    getSpendingByCategory(user.id, startOfMonth, endOfMonth),
    getMonthlySpending(user.id, 12),
    getDailySpending(user.id),
    getExpenses(user.id, { limit: 100 }),
    getTotalSpent(user.id, startOfMonth, endOfMonth),
    getUserSettings(user.id),
  ]);

  // Compute top expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <AnalyticsClient
      user={user}
      categoryData={categoryData}
      monthlyData={monthlyData}
      dailyData={dailyData}
      topExpenses={topExpenses}
      totalThisMonth={totalThisMonth}
      monthlyBudget={settings?.monthly_budget || 0}
    />
  );
}
