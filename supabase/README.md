# Database

`migrations/` holds numbered SQL files, applied in order. They are the only way
the schema changes. Never edit a table in the Supabase dashboard by hand; write
a migration so the change is recorded and repeatable.

Naming: `0001_short_description.sql`, `0002_...`.

Each migration must:
- enable Row Level Security on every new table,
- add policies for owner, consultant and viewer,
- be safe to run once and only once.

Migrations are applied by Claude through the Supabase connector, or by pasting
the file into the SQL editor of the project.
