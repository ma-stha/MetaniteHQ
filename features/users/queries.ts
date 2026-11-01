import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function listProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true })
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data;
}
