import { pool   } from "../db";

export async function getIncomeExpenseData(userId: string) {
  const result = await pool.query(
    `
    SELECT
      type,
      COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE user_id = $1
    GROUP BY type
    `,
    [userId]
  );

  const income =
    result.rows.find((row: { type: string; }) => row.type === "income")?.total ?? 0;

  const expense =
    result.rows.find((row: { type: string; }) => row.type === "expense")?.total ?? 0;

  return [
    {
      name: "Income",
      amount: Number(income),
    },
    {
      name: "Expense",
      amount: Number(expense),
    },
  ];
}

export async function getCategoryBreakdown(userId: string) {
  const result = await pool.query(
    `
    SELECT
      category,
      COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE user_id = $1
    AND type = 'expense'
    GROUP BY category
    ORDER BY total DESC
    `,
    [userId]
  );

  return result.rows.map((row: { category: any; total: any; }) => ({
    category: row.category,
    total: Number(row.total),
  }));
}

export async function getBudgetUsageData(userId: string) {
  const result = await pool.query(
    `
    SELECT
      b.category,
      b.monthly_limit,
      COALESCE(
        SUM(
          CASE
            WHEN t.type = 'expense'
            THEN t.amount
            ELSE 0
          END
        ),
        0
      ) AS spent
    FROM budgets b
    LEFT JOIN transactions t
      ON b.user_id = t.user_id
      AND b.category = t.category
    WHERE b.user_id = $1
    GROUP BY
      b.id,
      b.category,
      b.monthly_limit
    ORDER BY b.category
    `,
    [userId]
  );

  return result.rows.map((row: { monthly_limit: any; spent: any; category: any; }) => {
    const limit = Number(row.monthly_limit);
    const spent = Number(row.spent);

    return {
      category: row.category,
      spent,
      limit,
      percentUsed:
        limit === 0
          ? 0
          : Number(((spent / limit) * 100).toFixed(2)),
    };
  });
}