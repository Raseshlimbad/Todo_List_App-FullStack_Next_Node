"use client";

import { useMutation } from "@apollo/client";
import { SIGNUP } from "@/graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Destructure loading and error from useMutation
  const [signup, { loading, error }] = useMutation(SIGNUP, {
    onCompleted: () => router.push("/login"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ variables: { username, password } });
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
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

        {/* Signup Button */}
        <button type="submit" disabled={loading} className="bg-gray-700 text-white px-4 py-2 rounded">
          {loading ? "Signing up..." : "Signup"}
        </button>

        {/* Login link and test */}
        <p className="text-gray-400">Already have an account?
          <Link href={"/login"}><span className="hover:underline text-gray-700">Login</span></Link>
        </p>
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
}
