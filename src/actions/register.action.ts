"use server";

import bcrypt from "bcrypt";

import {
  createUser,
  getUserByEmail,
} from "../repositories/user.repository";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(
    name,
    email,
    hashedPassword
  );

  return {
    success: true,
    user,
  };
}