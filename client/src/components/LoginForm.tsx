"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/graphql/mutations";
import Link from "next/link";
import { GET_CURRENT_USER, GET_TODOS } from "@/graphql/queries";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Lofin Mutation
  const [login, { loading, error }] = useMutation(LOGIN, {
    refetchQueries: [{ query: GET_CURRENT_USER }, { query: GET_TODOS }]});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ variables: { username, password } });
      // After login, notify NavBar to refetch the user data
      router.push("/"); // Redirect to home page after login
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 min-w-96">
        {/* Username input field */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Login button */}
        <button type="submit" disabled={loading} className="bg-gray-700 text-white px-4 py-2 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup link and text */}
        <p className="text-gray-400">Don&apos;t have an account?
          <Link href={"/signup"}><span className="hover:underline text-gray-700">Register</span></Link>
        </p>

        {/* Display error message */}
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
}
