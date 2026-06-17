import { pool } from "../db";

export async function createTransaction(
  userId: string,
  type: string,
  category: string,
  amount: number,
  description: string,
  transactionDate: string
) {
  const result = await pool.query(
    `
    INSERT INTO transactions (
      user_id,
      type,
      category,
      amount,
      description,
      transaction_date
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      userId,
      type,
      category,
      amount,
      description,
      transactionDate,
    ]
  );

  return result.rows[0];
}

export async function getTransactionsByUserId(
  userId: string
) {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE user_id = $1
    ORDER BY transaction_date DESC
    `,
    [userId]
  );

  return result.rows;
}