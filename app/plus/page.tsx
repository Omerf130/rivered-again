"use client";

import { useState, useEffect } from "react";

interface Plus {
  _id: string;
  name: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function PlusPage() {
  const [pluses, setPluses] = useState<Plus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", amount: "" });

  // Fetch all pluses
  const fetchPluses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/pluses");
      const result = await response.json();

      if (result.ok) {
        setPluses(result.data);
      } else {
        setError(result.message || "Failed to fetch pluses");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create a new plus
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch("/api/pluses", {
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
        fetchPluses(); // Refresh the list
      } else {
        setError(result.message || "Failed to create plus");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Delete a plus
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plus?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/pluses/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.ok) {
        fetchPluses(); // Refresh the list
      } else {
        setError(result.message || "Failed to delete plus");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Load pluses on component mount
  useEffect(() => {
    fetchPluses();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-zinc-50">
        Plus Manager
      </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Plus Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Add New Plus
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter plus name"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Add Plus
            </button>
          </form>
        </div>

        {/* Pluses List */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Pluses
          </h2>

          {loading ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          ) : pluses.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              No pluses yet. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              {pluses.map((plus) => (
                <div
                  key={plus._id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-zinc-50">
                      {plus.name}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      ${plus.amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(plus._id)}
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