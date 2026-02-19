'use client';

import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import { MonthlyChart, CategoryChart, DailyChart } from './components/Charts';

export default function DashboardClient({
  user,
  expenses,
  totalSpent,
  totalThisMonth,
  totalLastMonth,
  monthlyBudget,
  categoryData,
  monthlyData,
  dailyData,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = useCallback(() => {
    setEditingExpense(null);
    setShowModal(true);
  }, []);

  const handleEditExpense = useCallback((expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingExpense(null);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar user={user} currentPath="/dashboard" onAddExpense={handleAddExpense} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</p>
          </div>

          {/* Summary Cards */}
          <SummaryCards
            totalSpent={totalSpent}
            monthlyBudget={monthlyBudget}
            totalThisMonth={totalThisMonth}
            totalLastMonth={totalLastMonth}
            expenseCount={expenses.length}
          />

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mt-6 lg:mt-8">
            <MonthlyChart data={monthlyData} />
            <CategoryChart data={categoryData} />
          </div>

          {/* Daily Chart */}
          <div className="mt-4 lg:mt-6">
            <DailyChart data={dailyData} />
          </div>

          {/* Expense List */}
          <div className="mt-4 lg:mt-6 mb-8">
            <ExpenseList expenses={expenses} onEdit={handleEditExpense} />
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AddExpenseModal
        isOpen={showModal}
        onClose={handleCloseModal}
        editExpense={editingExpense}
      />
    </div>
  );
}
