import { pool} from "../db";

export async function saveAffordabilityCheck(
  data: any
) {
  const result = await pool.query(
    `
    INSERT INTO affordability_checks (
      user_id,
      item_name,
      description,
      category,
      price,
      score,
      recommendation,
      financial_impact,
      reasons,
      salary_allowance,
      savings_allowance,
      total_allowance
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING *
    `,
    [
      data.userId,
      data.itemName,
      data.description,
      data.category,
      data.price,
      data.score,
      data.recommendation,
      data.financialImpact,
      data.reasons,
      data.salaryAllowance,
      data.savingsAllowance,
      data.totalAllowance,
    ]
  );

  return result.rows[0];
}

export async function getAffordabilityHistory(
  userId: string
) {
  const result = await pool.query(
    `
    SELECT *
    FROM affordability_checks
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}