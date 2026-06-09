"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../auth-actions";

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />
      <div>
        <label className="text-[12px] uppercase tracking-wider text-navy/60 font-semibold">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="mt-2 w-full px-4 py-3 rounded-xl border border-navy/15 outline-none focus:border-coral text-navy"
          placeholder="••••••••"
        />
      </div>
      {state?.error && <p className="text-[13px] text-coral">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-3.5 rounded-full bg-navy text-white font-semibold tracking-wide hover:bg-[#0a2342] transition-colors disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar al panel"}
      </button>
    </form>
  );
}
