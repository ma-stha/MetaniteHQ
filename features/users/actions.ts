"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireRole, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteSchema, setActiveSchema, updateNameSchema, updateRoleSchema } from "./schema";

export type ActionState = { error?: string; message?: string } | undefined;

function firstIssue(e: { issues: { message: string }[] }) {
  return e.issues[0]?.message ?? "Invalid input";
}

export async function inviteUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("owner");
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY is not set in Vercel, so invitations cannot be sent from here. Invite from the Supabase dashboard (Authentication, Users, Invite) instead.",
    };
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { full_name: parsed.data.full_name },
    redirectTo: `${proto}://${host}/auth/callback?next=/set-password`,
  });
  if (error) return { error: error.message };

  // The trigger creates the profile as consultant. Apply the chosen role.
  if (data.user && parsed.data.role !== "consultant") {
    await admin.from("profiles").update({ role: parsed.data.role }).eq("id", data.user.id);
  }

  revalidatePath("/settings/users");
  return { message: `Invitation sent to ${parsed.data.email}.` };
}

export async function updateRole(formData: FormData): Promise<void> {
  const me = await requireRole("owner");
  const parsed = updateRoleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClient();

  // Never let the last owner demote themselves.
  if (parsed.data.id === me.id && parsed.data.role !== "owner") {
    const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "owner").eq("is_active", true);
    if ((count ?? 0) <= 1) return;
  }

  await supabase.from("profiles").update({ role: parsed.data.role }).eq("id", parsed.data.id);
  revalidatePath("/settings/users");
}

export async function setActive(formData: FormData): Promise<void> {
  const me = await requireRole("owner");
  const parsed = setActiveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  if (parsed.data.id === me.id) return; // cannot deactivate yourself

  const supabase = await createClient();
  await supabase.from("profiles").update({ is_active: parsed.data.is_active }).eq("id", parsed.data.id);
  revalidatePath("/settings/users");
}

export async function updateMyName(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireUser();
  const parsed = updateNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.full_name }).eq("id", me.id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { message: "Saved." };
}
