import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardBody, CardHeader, CardTitle, StatTile } from "@/components/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const [{ denied }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const first = user?.full_name?.split(" ")[0];

  return (
    <>
      <PageHeader title={first ? `Hello, ${first}` : "Dashboard"} description="What needs attention today." />
      {denied ? (
        <p role="alert" className="mb-6 rounded-sm border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          That page is for owners only.
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="New leads" value="—" hint="Stage 7" />
        <StatTile label="Active engagements" value="—" hint="Stage 2" />
        <StatTile label="Reports due" value="—" hint="Stage 6" />
        <StatTile label="Overdue roadmap items" value="—" hint="Stage 5" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">Nothing yet. Items appear here once clients and engagements exist.</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">The activity feed fills as the team works.</p>
          </CardBody>
        </Card>
      </section>
    </>
  );
}
