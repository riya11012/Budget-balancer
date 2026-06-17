import { pool } from "../db";

export type BudgetAnalysis = {
  id: string;
  category: string;
  monthly_limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
};

export async function getBudgetAnalysisByUserId(
  userId: string
): Promise<BudgetAnalysis[]> {
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

  return result.rows.map(
    (row): BudgetAnalysis => {
      const limit = Number(
        row.monthly_limit
      );

      const spent = Number(row.spent);

      return {
        id: row.id,
        category: row.category,
        monthly_limit: limit,
        spent,
        remaining: limit - spent,
        percentUsed:
          limit === 0
            ? 0
            : Number(
                (
                  (spent / limit) *
                  100
                ).toFixed(2)
              ),
      };
    }
  );
}