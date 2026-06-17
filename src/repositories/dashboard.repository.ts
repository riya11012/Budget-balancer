import { pool } from "../db";

export async function getDashboardSummary(
  userId: string
) {
  const incomeResult = await pool.query(
    `
    SELECT COALESCE(SUM(amount),0) AS total_income
    FROM transactions
    WHERE user_id = $1
    AND type = 'income'
    `,
    [userId]
  );

  const expenseResult = await pool.query(
    `
    SELECT COALESCE(SUM(amount),0) AS total_expense
    FROM transactions
    WHERE user_id = $1
    AND type = 'expense'
    `,
    [userId]
  );

  const totalIncome = Number(
    incomeResult.rows[0].total_income
  );

  const totalExpense = Number(
    expenseResult.rows[0].total_expense
  );

  return {
    totalIncome,
    totalExpense,
    netSavings:
      totalIncome - totalExpense,
  };
}

export async function getRecentTransactions(
  userId: string
) {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE user_id = $1
    ORDER BY transaction_date DESC
    LIMIT 5
    `,
    [userId]
  );

  return result.rows;
}

export async function getRecentAffordabilityChecks(
  userId: string
) {
  const result = await pool.query(
    `
    SELECT *
    FROM affordability_checks
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [userId]
  );

  return result.rows;
}

export async function getBudgetOverview(
  userId: string
) {
  const result = await pool.query(
    `
    SELECT
      b.id,
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

  return result.rows.map((budget) => ({
    ...budget,

    monthly_limit: Number(
      budget.monthly_limit
    ),

    spent: Number(budget.spent),

    remaining:
      Number(budget.monthly_limit) -
      Number(budget.spent),

    percentUsed:
      Number(budget.monthly_limit) === 0
        ? 0
        : Math.round(
            (Number(budget.spent) /
              Number(
                budget.monthly_limit
              )) *
              100
          ),
  }));
}