"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver }
from "@hookform/resolvers/zod";

import {
  transactionSchema,
  TransactionInput,
}
from "../../schemas/transaction.schema";

import {
  saveTransaction,
}
from "../../actions/transaction.action";

export default function TransactionsPage() {
  const [message,setMessage] =
    useState("");

  const {
    register,
    handleSubmit,
  } = useForm<TransactionInput>({
    resolver:
      zodResolver(transactionSchema),
  });

  async function onSubmit(
    data: TransactionInput
  ) {
    await saveTransaction(data);

    setMessage(
      "Transaction saved"
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-5">
        Add Transaction
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <select
          {...register("type")}
          className="border p-2 w-full"
        >
          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <input
          {...register("category")}
          placeholder="Category"
          className="border p-2 w-full"
        />

        <input
          type="number"
          {...register("amount")}
          placeholder="Amount"
          className="border p-2 w-full"
        />

        <input
          {...register("description")}
          placeholder="Description"
          className="border p-2 w-full"
        />

        <input
          type="date"
          {...register(
            "transactionDate"
          )}
          className="border p-2 w-full"
        />

        <button
          className="bg-black text-white px-4 py-2"
        >
          Save
        </button>
      </form>

      <p>{message}</p>

    </div>
  );
}