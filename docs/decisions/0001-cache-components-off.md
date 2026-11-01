# 0001. Cache Components off for v1

Date: 2026-11-02
Status: Accepted

## Context

Next.js 16 enables Cache Components by default in new projects. It prerenders a
static shell and requires every read of cookies or session to sit behind a
Suspense boundary.

## Decision

Disable it (`cacheComponents: false`). Every screen in Metanite HQ is behind a
login and shows per-user data. There is no public, static content to benefit.

## Consequences

Simpler code: pages read the session at the top and render. No Suspense
plumbing for auth. Slightly slower first paint on navigation, which does not
matter for an internal tool with a handful of users. Revisit if a public
client portal is added.
