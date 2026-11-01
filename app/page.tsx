import { Badge, bandTone, Button, Card, CardBody, CardHeader, CardTitle, Field, Input, Logo, StatTile, Table, TBody, TD, TH, THead, TR } from "@/components/ui";
import { BAND_LABEL, bandFor, DIMENSIONS } from "@/lib/scoring";

export const dynamic = "force-dynamic";

function envStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    url: Boolean(url),
    anon: Boolean(anon),
    service: Boolean(service),
    host: url ? new URL(url).host : null,
  };
}

// Demonstration data only. Not a real client or audit.
const DEMO_SCORES = [72, 45, 38, 61, 55, 22, 68];

export default function Home() {
  const env = envStatus();
  const ok = env.url && env.anon;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between border-b border-line pb-6">
        <Logo />
        <Badge tone="green">Stage 0</Badge>
      </header>

      <section className="py-10">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Metanite HQ</h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Internal operating system for Metanite Marketing. Foundations are in place. Sign-in and the
          first screens arrive in stage 1.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Supabase URL" value={env.url ? "Set" : "Missing"} hint={env.host ?? "NEXT_PUBLIC_SUPABASE_URL"} tone={env.url ? "green" : "red"} />
        <StatTile label="Anon key" value={env.anon ? "Set" : "Missing"} hint="NEXT_PUBLIC_SUPABASE_ANON_KEY" tone={env.anon ? "green" : "red"} />
        <StatTile label="Service key" value={env.service ? "Set" : "Missing"} hint="SUPABASE_SERVICE_ROLE_KEY (server only)" tone={env.service ? "green" : "amber"} />
      </section>

      {!ok ? (
        <p className="mt-4 text-sm text-amber">
          Add the missing variables in Vercel (Settings, Environment Variables) and redeploy.
        </p>
      ) : null}

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scorecard preview</CardTitle>
            <Badge>Demo data</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <Table className="border-0">
              <THead>
                <tr>
                  <TH>Dimension</TH>
                  <TH className="text-right">Score</TH>
                  <TH>Band</TH>
                </tr>
              </THead>
              <TBody>
                {DIMENSIONS.map((d, i) => {
                  const s = DEMO_SCORES[i];
                  const b = bandFor(s);
                  return (
                    <TR key={d.key}>
                      <TD className="text-white">{d.label}</TD>
                      <TD className="tabular text-right font-semibold text-white">{s}</TD>
                      <TD>
                        <Badge tone={bandTone[b]}>{BAND_LABEL[b]}</Badge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Field label="Client name" hint="Legal or trading name.">
              <Input placeholder="e.g. Harbourside Dental" />
            </Field>
            <Field label="Website">
              <Input placeholder="https://" />
            </Field>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Delete</Button>
            </div>
          </CardBody>
        </Card>
      </section>

      <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
        Metanite Marketing. Internal tool. Not indexed.
      </footer>
    </main>
  );
}
