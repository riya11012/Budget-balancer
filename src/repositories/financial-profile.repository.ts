import { pool } from "../db";


export async function createFinancialProfile(
  userId: string,
  monthlySalary: number,
  currentSavings: number,
  emergencyFund: number
) {
  const query = `
    INSERT INTO financial_profiles (
      user_id,
      monthly_salary,
      current_savings,
      emergency_fund
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    monthlySalary,
    currentSavings,
    emergencyFund,
  ]);

  return result.rows[0];
}

export async function getFinancialProfileByUserId(
  userId: string
) {
  const query = `
    SELECT *
    FROM financial_profiles
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
}

export async function updateFinancialProfile(
  userId: string,
  monthlySalary: number,
  currentSavings: number,
  emergencyFund: number
) {
  const query = `
    UPDATE financial_profiles
    SET
      monthly_salary = $2,
      current_savings = $3,
      emergency_fund = $4,
      updated_at = NOW()
    WHERE user_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    monthlySalary,
    currentSavings,
    emergencyFund,
  ]);

  return result.rows[0];
}