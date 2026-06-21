"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type CategoryData = {
  category: string;
  total: number;
};

const COLORS = [
  "#010028", // Deep Blue
  "#03C04A", // Emerald Green
  "#990F02", // Amber Brown
  "#991B1B", // Dark Red
  "#5B21B6", // Deep Purple
  "#831843", // Dark Pink
];

export function CategoryPieChart({
  data,
}: {
  data: CategoryData[];
}) {
  if (!data.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border bg-white text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        No spending data yet
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-black dark:text-white">
        Spending by Category
      </h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}