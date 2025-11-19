"use client";

import { useState, useEffect } from "react";

interface General {
  _id: string;
  title: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function GeneralPage() {
  const [generals, setGenerals] = useState<General[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", amount: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ title: "", amount: "" });

  // Fetch all generals
  const fetchGenerals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/generals");
      const result = await response.json();

      if (result.ok) {
        setGenerals(result.data);
      } else {
        setError(result.message || "Failed to fetch generals");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create a new general
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch("/api/generals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setFormData({ title: "", amount: "" });
        fetchGenerals(); // Refresh the list
      } else {
        setError(result.message || "Failed to create general");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Start editing a general
  const handleEdit = (general: General) => {
    setEditingId(general._id);
    setEditFormData({
      title: general.title,
      amount: general.amount.toString(),
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: "", amount: "" });
  };

  // Update a general
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      setError(null);
      const response = await fetch(`/api/generals/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editFormData.title,
          amount: parseFloat(editFormData.amount),
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setEditingId(null);
        setEditFormData({ title: "", amount: "" });
        fetchGenerals(); // Refresh the list
      } else {
        setError(result.message || "Failed to update general");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Delete a general
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this general?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/generals/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.ok) {
        fetchGenerals(); // Refresh the list
      } else {
        setError(result.message || "Failed to delete general");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  // Load generals on component mount
  useEffect(() => {
    fetchGenerals();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-zinc-50">
        General Manager
      </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add General Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Add New General
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter general title"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Add General
            </button>
          </form>
        </div>

        {/* Edit General Form (shown when editing) */}
        {editingId && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 mb-8 border-2 border-orange-500">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
              Edit General
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-zinc-50">
                  Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                  placeholder="Enter general title"
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
                  value={editFormData.amount}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, amount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Update General
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Generals List */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            Generals
          </h2>

          {loading ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          ) : generals.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              No generals yet. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              {generals.map((general) => (
                <div
                  key={general._id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-black dark:text-zinc-50">
                      {general.title}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      ${general.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(general)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(general._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
}