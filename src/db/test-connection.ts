import { pool } from ".";

export async function testConnection() {
  const result = await pool.query(`
    SELECT NOW()
  `);

  console.log(result.rows);
}