"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";

import {
  loginSchema,
  LoginInput,

} from "../../schemas/login.schema";


export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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

        <button
          type="submit"
          className="bg-black text-white px-4 py-2"
        >
          Login
        </button>
        
      </form>
    </div>
  );
}