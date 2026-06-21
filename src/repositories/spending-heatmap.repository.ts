import { pool } from "../db";

export async function getSpendingHeatmapData(userId: string) {
  const result = await pool.query(
    `
    SELECT
      transaction_date::date AS date,
      COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE user_id = $1
      AND type = 'expense'
      AND transaction_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY transaction_date::date
    ORDER BY transaction_date::date
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    date: row.date,
    total: Number(row.total),
  }));
}