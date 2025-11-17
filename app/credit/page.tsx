"use client";

import { useState, useEffect } from "react";

interface Credit {
  _id: string;
  name: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function CreditPage() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", amount: "" });

  // Fetch all credits
  const fetchCredits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/credits");
      const result = await response.json();

      if (result.ok) {
        setCredits(result.data);
      } else {
        setError(result.message || "Failed to fetch credits");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create a new credit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch("/api/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setFormData({ name: "", amount: "" });
        fetchCredits(); // Refresh the list
      } else {
        setError(result.message || "Failed to create credit");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Delete a credit
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this credit?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/credits/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.ok) {
        fetchCredits(); // Refresh the list
      } else {
        setError(result.message || "Failed to delete credit");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Load credits on component mount
  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-zinc-50">
        Credit Manager
      </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Credit Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Add New Credit
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter credit name"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Add Credit
            </button>
          </form>
        </div>

        {/* Credits List */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Credits
          </h2>

          {loading ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          ) : credits.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              No credits yet. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              {credits.map((credit) => (
                <div
                  key={credit._id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-zinc-50">
                      {credit.name}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      ${credit.amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(credit._id)}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
}