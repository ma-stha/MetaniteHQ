import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { SetPasswordForm } from "@/features/auth/components/auth-forms";

export const metadata: Metadata = { title: "Set password" };

export default async function SetPasswordPage() {
  const user = await requireUser();
  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Set your password</h1>
      <p className="mb-6 text-sm text-muted">Signed in as {user.email}.</p>
      <SetPasswordForm />
    </>
  );
}
