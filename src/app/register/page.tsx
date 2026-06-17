"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterInput,
} from "../../schemas/register.schema";

import { registerUser } from "../../actions/register.action";

export default function RegisterPage() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    const result = await registerUser(
      data.name,
      data.email,
      data.password
    );

    setMessage(result.message || "Registration successful");
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <input
          {...register("name")}
          placeholder="Name"
          className="border p-2 w-full"
        />

        <p>{errors.name?.message}</p>

        <input
          {...register("email")}
          placeholder="Email"
          className="border p-2 w-full"
        />

        <p>{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="border p-2 w-full"
        />

        <p>{errors.password?.message}</p>

        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className="border p-2 w-full"
        />

        <p>{errors.confirmPassword?.message}</p>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2"
        >
          Register
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}