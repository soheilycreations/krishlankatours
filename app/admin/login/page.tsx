"use client";

import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { signIn, signOut } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [denied, setDenied] = useState(false);

  // ?denied=1 → signed in with an account that isn't on the admin allowlist.
  useEffect(() => {
    setDenied(new URLSearchParams(window.location.search).has("denied"));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await signIn(undefined, formData);
      if (result?.error) {
        setError(result.error);
        setPending(false);
      }
    } catch (err) {
      // redirect() is delivered as a thrown control-flow signal — let Next handle it.
      if (err && typeof err === "object" && "digest" in err) throw err;
      setError("Something went wrong. Please try again.");
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

        {denied && (
          <div className="mb-5 font-body text-sm text-red-700 bg-red-50 rounded-lg px-3 py-3">
            <p className="mb-2">This account doesn&apos;t have admin access.</p>
            <form action={signOut}>
              <button type="submit" className="underline hover:no-underline">
                Sign out and use a different account
              </button>
            </form>
          </div>
        )}

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
      </div>
    </div>
  );
}
