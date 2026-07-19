"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { signIn } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await signIn(undefined, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
    // on success, signIn() redirects server-side
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Admin sign in</h1>
        <p className="font-body text-sm text-ink-text/55 mb-6">
          Krish Lanka Tours & Travels
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-navy/15 rounded-lg px-3.5 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
            />
          </div>
          <div>
            <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-navy/15 rounded-lg px-3.5 py-2.5 font-body text-sm text-navy focus:border-blue outline-none"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-blue text-white px-5 py-3 rounded-full font-body font-medium hover:bg-blue-light transition-colors disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"} <LogIn size={16} />
          </button>
        </form>

        <p className="font-body text-xs text-ink-text/40 mt-6 leading-relaxed">
          No account yet? Create one in your Supabase dashboard under
          Authentication → Users → Add user. See the README for details.
        </p>
      </div>
    </div>
  );
}
