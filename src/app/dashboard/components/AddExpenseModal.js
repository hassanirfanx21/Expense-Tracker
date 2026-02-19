'use client';

import { useState, useTransition } from 'react';
import { addExpense, updateExpense, CATEGORIES } from '../../../lib/actions';
import { HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AddExpenseModal({ isOpen, onClose, editExpense = null }) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!editExpense;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        let result;
        if (isEditing) {
          result = await updateExpense(editExpense.id, formData);
        } else {
          result = await addExpense(formData);
        }

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(isEditing ? 'Expense updated!' : 'Expense added!');
          onClose();
        }
      } catch (err) {
        toast.error('Something went wrong');
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 lg:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isEditing ? 'Update your expense details' : 'Track your spending'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-xl transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expense Name
            </label>
            <input
              type="text"
              name="item_name"
              defaultValue={editExpense?.item_name || ''}
              placeholder="e.g., Lunch, Uber ride, Netflix..."
              required
              className="input-field"
            />
          </div>

          {/* Amount & Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                defaultValue={editExpense?.amount || ''}
                placeholder="0.00"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                defaultValue={editExpense?.date || today}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="relative cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    defaultChecked={editExpense?.category === cat.value || (!editExpense && cat.value === 'food')}
                    className="peer sr-only"
                    required
                  />
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-dark-500 
                                  peer-checked:border-accent-primary peer-checked:bg-accent-primary/10 
                                  hover:border-dark-400 transition-all duration-200 text-gray-400 
                                  peer-checked:text-accent-primary">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-xs font-medium truncate">{cat.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              name="notes"
              defaultValue={editExpense?.notes || ''}
              placeholder="Add any additional details..."
              rows={2}
              className="input-field resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 btn-primary text-sm disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                isEditing ? 'Update Expense' : 'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
