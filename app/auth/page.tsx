"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getSupabaseClient } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Supabase environment variables are required for live auth.");

  async function signIn(mode: "signin" | "signup") {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus("Add Supabase env vars in .env.local, then restart npm run dev.");
      return;
    }

    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;
    setStatus(error ? error.message : mode === "signin" ? "Signed in." : "Check your email to confirm signup.");
  }

  return (
    <AppShell>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-lg border border-clinical-line bg-white p-6 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-clinical-navy">Sign in or create account</h1>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-md border border-clinical-line px-3 py-2 outline-none focus:border-clinical-teal focus:ring-2 focus:ring-clinical-teal/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-md border border-clinical-line px-3 py-2 outline-none focus:border-clinical-teal focus:ring-2 focus:ring-clinical-teal/20"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => signIn("signin")}
                className="rounded-md bg-clinical-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => signIn("signup")}
                className="rounded-md border border-clinical-line px-4 py-2.5 text-sm font-semibold text-clinical-navy hover:bg-slate-50"
              >
                Sign up
              </button>
            </div>
          </div>
          <p className="mt-5 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">{status}</p>
        </section>
      </div>
    </AppShell>
  );
}
