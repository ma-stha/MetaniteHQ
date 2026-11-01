"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema, setPasswordSchema, signInSchema } from "./schema";

export type ActionState = { error?: string; message?: string } | undefined;

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Only allow redirects inside this app, never to another site. */
function safeNext(next: unknown): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: "Email or password is incorrect." };

  redirect(safeNext(parsed.data.next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${await siteOrigin()}/auth/callback?next=/set-password`,
  });
  // Same message whether or not the email exists, so the form cannot be used
  // to discover who has an account.
  return { message: "If that address has an account, a reset link is on its way." };
}

export async function setPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = setPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  redirect("/dashboard");
}
