import { pool   } from "../db";
export async function upsertAffordabilityRule(
  userId: string,
  salaryPercentage: number,
  savingsPercentage: number,
  protectEmergencyFund: boolean
) {
  const result = await pool.query(
    `
    INSERT INTO affordability_rules(
      user_id,
      salary_percentage,
      savings_percentage,
      protect_emergency_fund
    )
    VALUES($1,$2,$3,$4)

    ON CONFLICT(user_id)

    DO UPDATE SET
      salary_percentage = EXCLUDED.salary_percentage,
      savings_percentage = EXCLUDED.savings_percentage,
      protect_emergency_fund = EXCLUDED.protect_emergency_fund,
      updated_at = NOW()

    RETURNING *
    `,
    [
      userId,
      salaryPercentage,
      savingsPercentage,
      protectEmergencyFund,
    ]
  );

  return result.rows[0];
}

export async function getRuleByUserId(
  userId: string
) {
  const result = await pool.query(
    `
    SELECT *
    FROM affordability_rules
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
}