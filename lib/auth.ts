import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

export type Profile = Tables<"profiles">;
export type Role = Profile["role"];

/**
 * Data Access Layer for the current user. Cached per request, so calling it
 * from a layout and several components costs one round trip.
 */
export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return profile ?? null;
});

/** Redirects to /login when signed out, /inactive when deactivated. */
export async function requireUser(): Promise<Profile> {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  if (!profile.is_active) redirect("/inactive");
  return profile;
}

export async function requireRole(...roles: Role[]): Promise<Profile> {
  const profile = await requireUser();
  if (!roles.includes(profile.role)) redirect("/dashboard?denied=1");
  return profile;
}

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  consultant: "Consultant",
  viewer: "Viewer",
};
