import type { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/auth-forms";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Sign in</h1>
      <p className="mb-6 text-sm text-muted">Use the email address you were invited with.</p>
      {error === "link" ? (
        <p role="alert" className="mb-4 text-sm text-red">
          That link is invalid or has expired. Ask for a new one.
        </p>
      ) : null}
      <SignInForm next={next} />
    </>
  );
}
