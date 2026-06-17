import { pool } from "../db";

export async function getAIContext(userId: string) {
  const profileResult = await pool.query(
    `
    SELECT monthly_salary, current_savings, emergency_fund
    FROM financial_profiles
    WHERE user_id = $1
    `,
    [userId]
  );

  const transactionsResult = await pool.query(
    `
    SELECT type, category, amount, description, transaction_date
    FROM transactions
    WHERE user_id = $1
    ORDER BY transaction_date DESC
    LIMIT 20
    `,
    [userId]
  );

  const budgetsResult = await pool.query(
    `
    SELECT category, monthly_limit
    FROM budgets
    WHERE user_id = $1
    `,
    [userId]
  );

  const affordabilityResult = await pool.query(
    `
    SELECT item_name, category, price, score, recommendation, created_at
    FROM affordability_checks
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 10
    `,
    [userId]
  );

  return {
    profile: profileResult.rows[0] || null,
    transactions: transactionsResult.rows,
    budgets: budgetsResult.rows,
    affordabilityChecks: affordabilityResult.rows,
  };
}