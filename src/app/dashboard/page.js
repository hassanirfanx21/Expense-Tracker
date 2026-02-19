import { createServerSupabaseClient } from '../../lib/supabase-server';
import { redirect } from 'next/navigation';
import { getExpenses, getTotalSpent, getSpendingByCategory, getMonthlySpending, getDailySpending, getUserSettings } from '../../lib/actions';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get current month boundaries
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  // Get last month boundaries
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

  // Fetch all data in parallel
  const [expenses, totalSpent, totalThisMonth, totalLastMonth, categoryData, monthlyData, dailyData, settings] = await Promise.all([
    getExpenses(user.id, { limit: 50 }),
    getTotalSpent(user.id),
    getTotalSpent(user.id, startOfMonth, endOfMonth),
    getTotalSpent(user.id, startOfLastMonth, endOfLastMonth),
    getSpendingByCategory(user.id, startOfMonth, endOfMonth),
    getMonthlySpending(user.id, 6),
    getDailySpending(user.id),
    getUserSettings(user.id),
  ]);

  return (
    <DashboardClient
      user={user}
      expenses={expenses}
      totalSpent={totalSpent}
      totalThisMonth={totalThisMonth}
      totalLastMonth={totalLastMonth}
      monthlyBudget={settings?.monthly_budget || 0}
      categoryData={categoryData}
      monthlyData={monthlyData}
      dailyData={dailyData}
    />
  );
}
