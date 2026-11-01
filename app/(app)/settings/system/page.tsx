import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle, StatTile } from "@/components/ui";

export const metadata: Metadata = { title: "System" };

export default async function SystemPage() {
  await requireRole("owner");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const service = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const intake = Boolean(process.env.INTAKE_SHARED_SECRET);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Supabase URL" value={url ? "Set" : "Missing"} hint={url ? new URL(url).host : undefined} tone={url ? "green" : "red"} />
        <StatTile label="Anon key" value={anon ? "Set" : "Missing"} tone={anon ? "green" : "red"} />
        <StatTile label="Service key" value={service ? "Set" : "Missing"} hint="Needed to invite users from here" tone={service ? "green" : "amber"} />
        <StatTile label="Intake secret" value={intake ? "Set" : "Missing"} hint="Stage 7" tone={intake ? "green" : "neutral"} />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Where things live</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2 text-sm text-text">
          <p>Environment variables: Vercel, Project Settings, Environment Variables.</p>
          <p>Database, auth and files: Supabase project metanite-hq (Sydney).</p>
          <p>Code and deployments: GitHub ma-stha/MetaniteHQ, deployed by Vercel on every push to main.</p>
        </CardBody>
      </Card>
    </div>
  );
}
