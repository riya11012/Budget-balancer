import { pool } from "../db";
export async function createBudget(
  userId: string,
  category: string,
  monthlyLimit: number
) {
  const result = await pool.query(
    `
    INSERT INTO budgets(
      user_id,
      category,
      monthly_limit
    )
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [userId, category, monthlyLimit]
  );

  return result.rows[0];
}