"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Field, Input } from "@/components/ui";
import { requestPasswordReset, setPassword, signIn, type ActionState } from "../actions";

function Notice({ state }: { state: ActionState }) {
  if (!state?.error && !state?.message) return null;
  return (
    <p role="alert" className={state.error ? "text-sm text-red" : "text-sm text-green"}>
      {state.error ?? state.message}
    </p>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required autoFocus />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Notice state={state} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted">
        <Link href="/forgot-password" className="hover:text-white">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required autoFocus />
      </Field>
      <Notice state={state} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-muted">
        <Link href="/login" className="hover:text-white">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(setPassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="New password" hint="At least 10 characters.">
        <Input name="password" type="password" autoComplete="new-password" required autoFocus />
      </Field>
      <Field label="Confirm password">
        <Input name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <Notice state={state} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save password"}
      </Button>
    </form>
  );
}
