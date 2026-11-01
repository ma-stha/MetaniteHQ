import Link from "next/link";
import { Button, Logo } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">It may have moved, or never existed.</p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button variant="secondary">Go to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
