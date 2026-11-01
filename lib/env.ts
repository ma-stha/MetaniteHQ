import { z } from "zod";

// Validates environment variables the first time they are used, so a missing
// key fails loudly with a clear message instead of a confusing error deep
// inside a request. Validation is lazy (not at import time) so `next build`
// succeeds even when Vercel has no variables set yet.
//
// NEXT_PUBLIC_* values are safe in the browser. Everything else is server-only.

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20, "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  INTAKE_SHARED_SECRET: z.string().min(16).optional(),
});

function explain(error: z.ZodError) {
  const keys = error.issues.map((i) => i.path.join(".")).join(", ");
  return `Missing or invalid environment variables: ${keys}. Set them in Vercel (Project Settings, Environment Variables) or .env.local, then redeploy.`;
}

let publicCache: z.infer<typeof publicSchema> | undefined;

/** Public env. Safe in the browser and on the server. */
export function publicEnv() {
  if (publicCache) return publicCache;
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!parsed.success) throw new Error(explain(parsed.error));
  publicCache = parsed.data;
  return publicCache;
}

/** Server-only. Never import this from a client component. */
export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() was called in the browser");
  }
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) throw new Error(explain(parsed.error));
  return parsed.data;
}

/** True when the public variables are present. Used for status screens. */
export function hasPublicEnv() {
  return publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }).success;
}
