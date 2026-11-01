import { z } from "zod";

// Validates environment variables once, at startup, so a missing key fails
// loudly instead of producing a confusing error deep inside a request.
//
// NEXT_PUBLIC_* values are safe in the browser. Everything else is server-only.

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  INTAKE_SHARED_SECRET: z.string().min(16).optional(),
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

/** Server-only. Never import this from a client component. */
export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() was called in the browser");
  }
  return serverSchema.parse(process.env);
}
