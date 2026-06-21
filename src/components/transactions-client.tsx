"use client";

import {
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useEffect } from "react";
import { predictTransactionCategory } from "../actions/categorize-transaction.action";
import { saveTransaction } from "../actions/transaction.action";

type Transaction = {
  id: string;
  type: string;
  category: string;
  amount: number;
  description?: string;
  transaction_date?: string;
  pending?: boolean;
};

export function TransactionsClient({
  initialTransactions = [],
}: {
  initialTransactions?: Transaction[];
}) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [
    optimisticTransactions,
    addOptimisticTransaction,
  ] = useOptimistic<Transaction[], Transaction>(
    initialTransactions,
    (state, newTransaction) => [
      newTransaction,
      ...state,
    ]
  );

  async function handleSubmit(formData: FormData) {
    setError("");

    const data = {
      type: String(formData.get("type")),
      category: String(formData.get("category")),
      amount: Number(formData.get("amount")),
      description: String(
        formData.get("description") || ""
      ),
      transactionDate: String(
        formData.get("transactionDate")
      ),
    };

    addOptimisticTransaction({
      id: crypto.randomUUID(),
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
      transaction_date: data.transactionDate,
      pending: true,
    });

    startTransition(async () => {
      try {
        await saveTransaction(data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to save transaction. Please try again."
        );
      }
    });
  }
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (description.trim().length < 4) return;
  
      const result = await predictTransactionCategory(description);
  
      if (result.category) {
        setCategory(result.category);
        setConfidence(result.confidence || 0);
      }
    }, 700);
  
    return () => clearTimeout(timer);
  }, [description]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Transactions
          </h1>

          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Add income and expenses. New transactions appear instantly.
          </p>
        </div>

        <form
          action={handleSubmit}
          className="grid gap-4 rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
        >
          <select
            name="type"
            defaultValue="expense"
            className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
  name="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  placeholder="Category"
  className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
  required
/>

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            required
          />

<input
  name="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Description e.g. Swiggy order 450"
  className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
/>

          <input
            name="transactionDate"
            type="date"
            className="rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white"
            required
          />

          <button className="rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            {isPending
              ? "Saving..."
              : "Add Transaction"}
          </button>
        </form>

        {confidence > 0 && (
  <p className="text-sm text-slate-500 dark:text-zinc-400">
    AI suggested category: {category} · {confidence}% confidence
  </p>
)}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Recent Transactions
          </h2>

          <div className="mt-5 space-y-4">
            {(optimisticTransactions || [])
              .length === 0 && (
              <p className="text-slate-500 dark:text-zinc-400">
                No transactions yet.
              </p>
            )}

            {(optimisticTransactions || []).map(
              (tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
                >
                  <div>
                    <p className="font-semibold text-black dark:text-white">
                      {tx.category}

                      {tx.pending && (
                        <span className="ml-2 rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                          Saving...
                        </span>
                      )}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                      {tx.description ||
                        "No description"}
                    </p>
                  </div>

                  <p
                    className={
                      tx.type === "income"
                        ? "text-lg font-bold text-green-600"
                        : "text-lg font-bold text-red-600"
                    }
                  >
                    {tx.type === "income"
                      ? "+"
                      : "-"}
                    ₹
                    {Number(
                      tx.amount
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}