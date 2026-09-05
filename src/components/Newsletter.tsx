"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/lib/toast";
import { IconArrow, IconCheck } from "./Icons";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
      push("Welcome to the house of OC");
    } catch {
      setState("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:py-28">
        <p className="text-[10px] font-semibold tracking-[0.34em] uppercase text-paper/50">
          The OC Letter
        </p>
        <h2 className="mt-4 font-display text-3xl italic md:text-5xl">
          First to know, never first to shout.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/60">
          New pieces, private previews and notes on fabric and form. One
          letter a month, nothing more.
        </p>

        {state === "done" ? (
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 border border-paper/25 px-6 py-4 text-sm animate-fade-in">
            <IconCheck className="h-4 w-4 text-success" />
            You are on the list. Welcome to OC.
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-md items-center border-b border-paper/30 focus-within:border-paper"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-paper/40"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              aria-label="Subscribe"
              className="p-2 transition-transform hover:translate-x-1 disabled:opacity-40"
            >
              {state === "loading" ? (
                <span className="block h-4 w-4 animate-spin rounded-full border border-paper/40 border-t-paper" />
              ) : (
                <IconArrow className="h-4 w-4" />
              )}
            </button>
          </form>
        )}
        {error && <p className="mt-3 text-xs text-danger">{error}</p>}
      </div>
    </section>
  );
}
