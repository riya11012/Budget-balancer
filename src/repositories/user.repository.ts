// src/repositories/user.repository.ts

import { pool } from "../db";

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
) {
  const query = `
    INSERT INTO users(name, email, password_hash)
    VALUES($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [
    name,
    email,
    passwordHash,
  ]);

  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
}

export async function getUserById(id: string) {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}