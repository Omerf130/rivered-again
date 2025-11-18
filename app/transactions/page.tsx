"use client";

import { useState, useEffect } from "react";

interface Transaction {
  _id: string;
  transaction: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ transaction: "", amount: "" });

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/transactions");
      const result = await response.json();

      if (result.ok) {
        setTransactions(result.data);
      } else {
        setError(result.message || "Failed to fetch transactions");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create a new transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: formData.transaction,
          amount: parseFloat(formData.amount),
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setFormData({ transaction: "", amount: "" });
        fetchTransactions(); // Refresh the list
      } else {
        setError(result.message || "Failed to create transaction");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Delete a transaction
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.ok) {
        fetchTransactions(); // Refresh the list
      } else {
        setError(result.message || "Failed to delete transaction");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-zinc-50">
          Transaction Manager
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Transaction Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Add New Transaction
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Description
              </label>
              <input
                type="text"
                value={formData.transaction}
                onChange={(e) =>
                  setFormData({ ...formData, transaction: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter transaction description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Transactions
          </h2>

          {loading ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              No transactions yet. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-zinc-50">
                      {transaction.transaction}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}