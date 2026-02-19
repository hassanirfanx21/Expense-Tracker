'use server';

import { createServerSupabaseClient } from './supabase-server';
import { revalidatePath } from 'next/cache';

// Category list
export const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍔', color: '#f59e0b' },
  { value: 'transport', label: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { value: 'bills', label: 'Bills & Utilities', icon: '💡', color: '#ef4444' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { value: 'health', label: 'Health & Fitness', icon: '💊', color: '#10b981' },
  { value: 'education', label: 'Education', icon: '📚', color: '#6366f1' },
  { value: 'travel', label: 'Travel', icon: '✈️', color: '#14b8a6' },
  { value: 'groceries', label: 'Groceries', icon: '🛒', color: '#84cc16' },
  { value: 'other', label: 'Other', icon: '📦', color: '#6b7280' },
];

// Add a new expense
export async function addExpense(formData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const item_name = formData.get('item_name');
  const amount = parseFloat(formData.get('amount'));
  const category = formData.get('category');
  const date = formData.get('date');
  const notes = formData.get('notes') || '';

  if (!item_name || !amount || !category || !date) {
    return { error: 'All fields are required' };
  }

  if (amount <= 0) {
    return { error: 'Amount must be greater than 0' };
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([{ item_name, amount, category, date, notes, user_id: user.id }])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { data };
}

// Update an expense
export async function updateExpense(id, formData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const item_name = formData.get('item_name');
  const amount = parseFloat(formData.get('amount'));
  const category = formData.get('category');
  const date = formData.get('date');
  const notes = formData.get('notes') || '';

  const { data, error } = await supabase
    .from('expenses')
    .update({ item_name, amount, category, date, notes })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { data };
}

// Delete an expense
export async function deleteExpense(id) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// Get total spent (using SQL sum)
export async function getTotalSpent(userId, startDate, endDate) {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId);

  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;

  if (error) return 0;

  return data.reduce((sum, expense) => sum + expense.amount, 0);
}

// Get expenses with filters
export async function getExpenses(userId, filters = {}) {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.startDate) query = query.gte('date', filters.startDate);
  if (filters.endDate) query = query.lte('date', filters.endDate);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) return [];
  return data;
}

// Get spending by category
export async function getSpendingByCategory(userId, startDate, endDate) {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('expenses')
    .select('category, amount')
    .eq('user_id', userId);

  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;
  if (error) return [];

  const categoryTotals = {};
  data.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  return Object.entries(categoryTotals).map(([category, total]) => {
    const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[CATEGORIES.length - 1];
    return {
      name: cat.label,
      value: parseFloat(total.toFixed(2)),
      color: cat.color,
      icon: cat.icon,
    };
  }).sort((a, b) => b.value - a.value);
}

// Get monthly spending data for charts
export async function getMonthlySpending(userId, months = 6) {
  const supabase = createServerSupabaseClient();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);

  const { data, error } = await supabase
    .from('expenses')
    .select('amount, date')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) return [];

  const monthlyData = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize all months
  for (let i = 0; i < months; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (months - 1 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[key] = {
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      total: 0,
    };
  }

  data.forEach((expense) => {
    const d = new Date(expense.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyData[key]) {
      monthlyData[key].total += expense.amount;
    }
  });

  return Object.values(monthlyData).map((m) => ({
    ...m,
    total: parseFloat(m.total.toFixed(2)),
  }));
}

// Get daily spending for current month
export async function getDailySpending(userId) {
  const supabase = createServerSupabaseClient();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from('expenses')
    .select('amount, date')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) return [];

  const dailyData = {};
  data.forEach((expense) => {
    const day = new Date(expense.date).getDate();
    if (!dailyData[day]) dailyData[day] = 0;
    dailyData[day] += expense.amount;
  });

  return Object.entries(dailyData).map(([day, total]) => ({
    day: parseInt(day),
    total: parseFloat(total.toFixed(2)),
  }));
}

// Update budget
export async function updateBudget(monthlyBudget) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ 
      user_id: user.id, 
      monthly_budget: monthlyBudget,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { data };
}

// Get user settings
export async function getUserSettings(userId) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return { monthly_budget: 0 };
  return data;
}
