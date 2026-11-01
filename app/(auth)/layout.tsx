import { Logo } from "@/components/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>
        <div className="rounded-sm border border-line bg-bg-2 p-6">{children}</div>
        <p className="mt-6 text-center text-xs text-muted">Metanite HQ is an internal tool. Access by invitation only.</p>
      </div>
    </main>
  );
}
