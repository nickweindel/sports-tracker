# Supabase Migrations

This folder contains SQL migration files for the project’s Supabase database.  Migration files are applied in chronological order based on their filenames.

---

## Initial Migration

The first migration file `20260206224440_remote_schema.sql` sets up the initial database schema.

---

## Running Migrations

Make sure the Supabase CLI is installed:

```bash
npm install -g supabase
```

1. Log in:

```bash
supabase login
```

2. Link to your project (local or remote):

```bash
supabase link --project-ref <PROJECT_REF>
```

3. Apply all migrations:

```bash
supabase db push
```

4. Check migration status:

```bash
supabase db status
```

> `supabase db push` will apply all unapplied migrations in order of filename.

---

## Creating New Migrations

1. Generate a new migration using the CLI:

```bash
supabase migration new <description>
```

> This creates a new SQL file in this folder with a timestamp prefix.

2. Add your schema or data changse to the generated file.

3. Apply migrations:

```bash
supabase db push
```

4. Commit the migration file.