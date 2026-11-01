import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@/components/shell/page-header";

export const metadata: Metadata = { title: "Library" };

export default function Page() {
  return (
    <>
      <PageHeader title="Library" />
      <EmptyState title="Not built yet" body="Reusable recommendations, curated by the owner." stage={5} />
    </>
  );
}
