import { z } from "zod";

export const ROLES = ["owner", "consultant", "viewer"] as const;

export const inviteSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  full_name: z.string().trim().min(1, "Enter their name").max(120),
  role: z.enum(ROLES),
});

export const updateRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(ROLES),
});

export const setActiveSchema = z.object({
  id: z.string().uuid(),
  is_active: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export const updateNameSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your name").max(120),
});
