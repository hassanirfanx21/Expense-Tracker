'use client';

import { useState, useTransition } from 'react';
import { deleteExpense } from '../../../lib/actions';
import { CATEGORIES } from '../../../lib/constants';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineDotsVertical, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ExpenseList({ expenses, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteExpense(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Expense deleted');
      }
      setDeletingId(null);
    });
  };

  const getCategoryInfo = (categoryValue) => {
    return CATEGORIES.find((c) => c.value === categoryValue) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Filter and sort
  let filtered = expenses.filter((expense) => {
    const matchesSearch = expense.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc': return new Date(a.date) - new Date(b.date);
      case 'amount-desc': return b.amount - a.amount;
      case 'amount-asc': return a.amount - b.amount;
      case 'name': return a.item_name.localeCompare(b.item_name);
      default: return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="glass-card rounded-2xl p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Expenses</h3>
          <p className="text-sm text-gray-500">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 bg-dark-800 border border-dark-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showFilters ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' : 'bg-dark-800 border-dark-500 text-gray-400 hover:text-white'
            }`}
          >
            <HiOutlineFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-5 p-4 bg-dark-800/50 rounded-xl border border-dark-600/50 animate-fade-in">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select-field text-sm w-auto"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select-field text-sm w-auto"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      )}

      {/* Expense Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-700 flex items-center justify-center">
            <span className="text-3xl">📋</span>
          </div>
          <p className="text-gray-400 font-medium">No expenses found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm || filterCategory !== 'all' ? 'Try adjusting your filters' : 'Add your first expense to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => {
            const cat = getCategoryInfo(expense.category);
            const isDeleting = deletingId === expense.id;

            return (
              <div
                key={expense.id}
                className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl hover:bg-dark-700/50 
                           transition-all duration-200 group ${isDeleting ? 'opacity-50' : ''}`}
              >
                {/* Category Icon */}
                <div
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-lg lg:text-xl flex-shrink-0"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  {cat.icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm lg:text-base font-medium text-gray-200 truncate">
                      {expense.item_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(expense.date + 'T00:00:00'), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm lg:text-base font-semibold text-white">
                    -${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-400 hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
