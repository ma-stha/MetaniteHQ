"use client";

import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { inviteUser } from "../actions";
import { ROLES } from "../schema";

const selectClass =
  "h-10 w-full rounded-sm border border-line bg-bg-3 px-3 text-sm text-white focus:border-green focus:outline-none";

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteUser, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[1fr_1fr_160px_auto] sm:items-end">
      <Field label="Name">
        <Input name="full_name" required />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required />
      </Field>
      <Field label="Role">
        <select name="role" defaultValue="consultant" className={selectClass}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r[0].toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send invite"}
      </Button>
      {state?.error || state?.message ? (
        <p role="alert" className={`sm:col-span-4 text-sm ${state.error ? "text-amber" : "text-green"}`}>
          {state.error ?? state.message}
        </p>
      ) : null}
    </form>
  );
}
