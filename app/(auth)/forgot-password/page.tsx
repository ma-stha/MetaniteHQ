import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/auth-forms";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Reset password</h1>
      <p className="mb-6 text-sm text-muted">We will email you a link to set a new one.</p>
      <ForgotPasswordForm />
    </>
  );
}
