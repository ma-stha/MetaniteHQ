import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@/components/shell/page-header";

export const metadata: Metadata = { title: "Leads" };

export default function Page() {
  return (
    <>
      <PageHeader title="Leads" />
      <EmptyState title="Not built yet" body="Website audit requests and applications land here, scored for fit." stage={7} />
    </>
  );
}
