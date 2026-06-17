"use client";

import { useState } from "react";
import { checkAffordability } from "../../actions/affordability.action";

type Result = {
  score: number;
  recommendation: "BUY" | "DELAY" | "AVOID";
  financialImpact: string;
  reasons: string[];
  salaryAllowance: number;
  savingsAllowance: number;
  totalAllowance: number;
};

export default function AffordabilityPage() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [result, setResult] =
    useState<Result | null>(null);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await checkAffordability({
      itemName,
      description,
      category,
      price: Number(price),
    });

    setResult(response);
  }

  function recommendationColor() {
    if (!result) return "";

    if (result.recommendation === "BUY") {
      return "bg-green-100 text-green-700";
    }

    if (result.recommendation === "DELAY") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Can I Afford This?
          </h1>

          <p className="text-slate-500 mt-2">
            Let Budget Balancer analyze your
            finances before making a purchase.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow border p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="font-medium">
                Purchase Name
              </label>

              <input
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
                }
                placeholder="Gaming Laptop"
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="RTX laptop for development"
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">
                Category
              </label>

              <input
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="Shopping"
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="85000"
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <button
              className="w-full bg-black text-white rounded-xl py-3 font-semibold"
            >
              Analyze Purchase
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow border p-8">

            <h2 className="text-2xl font-bold mb-6">
              Analysis Result
            </h2>

            <div
              className={`rounded-xl px-4 py-3 font-bold text-center mb-6 ${recommendationColor()}`}
            >
              {result.recommendation}
            </div>

            <div className="space-y-3">

              <p>
                <strong>Purchase Score:</strong>{" "}
                {result.score}/100
              </p>

              <p>
                <strong>Financial Impact:</strong>{" "}
                {result.financialImpact}
              </p>

              <p>
                <strong>Salary Allowance:</strong>{" "}
                ₹{result.salaryAllowance}
              </p>

              <p>
                <strong>Savings Allowance:</strong>{" "}
                ₹{result.savingsAllowance}
              </p>

              <p>
                <strong>Total Allowance:</strong>{" "}
                ₹{result.totalAllowance}
              </p>

            </div>

            <div className="mt-8">

              <h3 className="font-bold mb-3">
                Reasons
              </h3>

              <div className="space-y-2">

                {result.reasons.map(
                  (reason, index) => (
                    <div
                      key={index}
                      className="bg-slate-100 rounded-lg p-3"
                    >
                      {reason}
                    </div>
                  )
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}