"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Field, Input } from "@/components/ui";
import { updateMyName } from "../actions";

export function ProfileForm({ fullName }: { fullName: string }) {
  const [state, action, pending] = useActionState(updateMyName, undefined);
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <Field label="Your name">
        <Input name="full_name" defaultValue={fullName} required className="w-64" />
      </Field>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
      <Link href="/set-password" className="text-sm text-muted hover:text-white">
        Change password
      </Link>
      {state?.error || state?.message ? (
        <p role="alert" className={`w-full text-sm ${state.error ? "text-red" : "text-green"}`}>
          {state.error ?? state.message}
        </p>
      ) : null}
    </form>
  );
}
