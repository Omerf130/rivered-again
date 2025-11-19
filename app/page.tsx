"use client";

import { useState, useEffect } from "react";

interface Credit {
  _id: string;
  name: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Plus {
  _id: string;
  name: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Transaction {
  _id: string;
  transaction: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface General {
  _id: string;
  title: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [pluses, setPluses] = useState<Plus[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [generals, setGenerals] = useState<General[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data (credits, pluses, transactions, generals)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [creditsRes, plusesRes, transactionsRes, generalsRes] = await Promise.all([
          fetch("/api/credits"),
          fetch("/api/pluses"),
          fetch("/api/transactions"),
          fetch("/api/generals"),
        ]);

        const creditsData = await creditsRes.json();
        const plusesData = await plusesRes.json();
        const transactionsData = await transactionsRes.json();
        const generalsData = await generalsRes.json();

        if (creditsData.ok) {
          setCredits(creditsData.data);
        }
        if (plusesData.ok) {
          setPluses(plusesData.data);
        }
        if (transactionsData.ok) {
          setTransactions(transactionsData.data);
        }
        if (generalsData.ok && Array.isArray(generalsData.data)) {
          setGenerals(generalsData.data);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Group and sum by name/title (trimmed to ignore leading/trailing spaces)
  const groupedCredits = credits.reduce((acc: Record<string, number>, credit: Credit) => {
    const trimmedName = credit.name.trim();
    acc[trimmedName] = (acc[trimmedName] || 0) + credit.amount;
    return acc;
  }, {});

  const groupedPluses = pluses.reduce((acc: Record<string, number>, plus: Plus) => {
    const trimmedName = plus.name.trim();
    acc[trimmedName] = (acc[trimmedName] || 0) + plus.amount;
    return acc;
  }, {});

  const groupedTransactions = transactions.reduce((acc: Record<string, number>, transaction: Transaction) => {
    const trimmedTransaction = transaction.transaction.trim();
    acc[trimmedTransaction] = (acc[trimmedTransaction] || 0) + transaction.amount;
    return acc;
  }, {});

  const groupedGenerals = generals.reduce((acc: Record<string, number>, general: General) => {
    const trimmedTitle = general.title.trim();
    acc[trimmedTitle] = (acc[trimmedTitle] || 0) + (general?.amount || 0);
    return acc;
  }, {});

  // Calculate sums
  const creditsSum = credits.reduce((sum: number, credit: Credit) => sum + (credit.amount || 0), 0);
  const plusesSum = pluses.reduce((sum: number, plus: Plus) => sum + (plus.amount || 0), 0);
  const transactionsSum = transactions.reduce(
    (sum: number, transaction: Transaction) => sum + (transaction.amount || 0),
    0
  );
  const generalsSum = generals.reduce((sum: number, general: General) => sum + (general?.amount || 0), 0);
  const specificCalc = creditsSum + (generals.find((general) => general.title === "הוצאות")?.amount || 0) - (generals.find((general) => general.title === "ציפים")?.amount || 0) - (generals.find((general) => general.title === "בד ביט")?.amount || 0)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-zinc-50">
          Data Overview
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
            Loading...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Credits Container */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
                  Credits
                </h2>
                <div className="flex-1 space-y-2 mb-4">
                  {Object.keys(groupedCredits).length === 0 ? (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      No credits
                    </p>
                  ) : (
                    Object.entries(groupedCredits).map(([name, amount]) => (
                      <div
                        key={name}
                        className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-700"
                      >
                        <span className="text-black dark:text-zinc-50">
                          {name}
                        </span>
                        <span className="text-black dark:text-zinc-50 font-medium">
                          {amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-4 border-t-2 border-gray-300 dark:border-zinc-600">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      sum:
                    </span>
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      {creditsSum}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pluses Container */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
                  Pluses
                </h2>
                <div className="flex-1 space-y-2 mb-4">
                  {Object.keys(groupedPluses).length === 0 ? (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      No pluses
                    </p>
                  ) : (
                    Object.entries(groupedPluses).map(([name, amount]) => (
                      <div
                        key={name}
                        className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-700"
                      >
                        <span className="text-black dark:text-zinc-50">
                          {name}
                        </span>
                        <span className="text-black dark:text-zinc-50 font-medium">
                          {amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-4 border-t-2 border-gray-300 dark:border-zinc-600">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      sum:
                    </span>
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      {plusesSum}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions Container */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
                  Transactions
                </h2>
                <div className="flex-1 space-y-2 mb-4">
                  {Object.keys(groupedTransactions).length === 0 ? (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      No transactions
                    </p>
                  ) : (
                    Object.entries(groupedTransactions).map(([transaction, amount]) => (
                      <div
                        key={transaction}
                        className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-700"
                      >
                        <span className="text-black dark:text-zinc-50">
                          {transaction}
                        </span>
                        <span className="text-black dark:text-zinc-50 font-medium">
                          {amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-4 border-t-2 border-gray-300 dark:border-zinc-600">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      sum:
                    </span>
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      {transactionsSum}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generals Container */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
                  Generals
                </h2>
                <div className="flex-1 space-y-2 mb-4">
                  {Object.keys(groupedGenerals).length === 0 ? (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      No generals
                    </p>
                  ) : (
                    Object.entries(groupedGenerals).map(([title, amount]) => (
                      <div
                        key={title}
                        className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-zinc-700"
                      >
                        <span className="text-black dark:text-zinc-50">
                          {title}
                        </span>
                        <span className="text-black dark:text-zinc-50 font-medium">
                          {amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-4 border-t-2 border-gray-300 dark:border-zinc-600">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      sum:
                    </span>
                    <span className="text-lg font-bold text-black dark:text-zinc-50">
                      {generalsSum}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="specificCalc" style={{ display: "flex", justifyContent: "center", padding: "20px", gap:"15px" }}>
              <div style={{fontSize:"24px"}}>{specificCalc}</div>
              <h1 style={{fontSize:"24px"}}>גנייה
              </h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
}