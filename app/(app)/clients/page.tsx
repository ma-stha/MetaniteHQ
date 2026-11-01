import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@/components/shell/page-header";

export const metadata: Metadata = { title: "Clients" };

export default function Page() {
  return (
    <>
      <PageHeader title="Clients" />
      <EmptyState title="Not built yet" body="Every business Metanite works with, and their engagements." stage={2} />
    </>
  );
}
