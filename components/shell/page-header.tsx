export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ title, body, stage }: { title: string; body: string; stage?: number }) {
  return (
    <div className="rounded-sm border border-dashed border-line px-6 py-14 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {stage ? <p className="mt-4 text-xs uppercase tracking-wider text-muted">Arrives in stage {stage}</p> : null}
    </div>
  );
}
