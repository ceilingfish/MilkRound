---
name: atlas-schema-migrations
description: "Database schema migrations and schema-as-code operations. Use when: (1) Generating migration files from schema changes, (2) Diffing or comparing database schemas, (3) Linting migrations for safety and policy compliance, (4) Testing migrations before committing, (5) Applying migrations to databases, (6) Inspecting or validating schema definitions."
version: 1.0.0
---

# Atlas Schema Migrations

## Security

Never hardcode credentials. Use environment variables:

```hcl
env "prod" {
  url = getenv("DATABASE_URL")
}
```

## Quick Reference

Use `--help` on any command for comprehensive docs and examples:
```bash
atlas migrate diff --help
```

Always use `--env` to reference configurations from `atlas.hcl` - this avoids passing 
database credentials to the LLM context.

```bash
# Common
atlas schema inspect --env <name>                    # Inspect schema
atlas schema validate --env <name>                   # Validate schema syntax/semantics
atlas schema diff --env <name>                       # Compare schemas
atlas schema lint --env <name>                       # Check schema policies
atlas schema test --env <name>                       # Test schema

# Declarative workflow
atlas schema plan --env <name>                       # Plan schema changes
atlas schema apply --env <name> --dry-run            # Preview changes
atlas schema apply --env <name>                      # Apply schema changes

# Versioned workflow
atlas migrate diff --env <name> "migration_name"     # Generate migration
atlas migrate lint --env <name> --latest 1           # Validate migration
atlas migrate test --env <name>                      # Test migration
atlas migrate apply --env <name> --dry-run           # Preview changes
atlas migrate apply --env <name>                     # Apply migration
atlas migrate status --env <name>                    # Check status
```

## Core Concepts

### Configuration File (atlas.hcl)

Always read the project's `atlas.hcl` first - it contains environment configurations:

```hcl
env "<name>" {
  url = getenv("DATABASE_URL")
  dev = "docker://postgres/15/dev?search_path=public"
  
  migration {
    dir = "file://migrations"
  }
  
  schema {
    src = "file://schema.hcl"
  }
}
```

### Dev Database

Atlas uses a temporary "dev-database" to process and validate schemas. Common configurations:

```bash
--dev-url "docker://mysql/8/dev"
--dev-url "docker://postgres/15/db_name?search_path=public"
--dev-url "sqlite://dev?mode=memory"
```

## Workflows

### 1. Schema Inspection

Start with a high-level overview before diving into details:

```bash
# Login (required for Pro features like views, triggers, functions)
atlas login

# List tables (overview first)
atlas schema inspect --env <name> --format "{{ json . }}" | jq ".schemas[].tables[].name"

# Full SQL schema
atlas schema inspect --env <name> --format "{{ sql . }}"

# Filter with --include/--exclude (useful for large schemas)
atlas schema inspect --env <name> --include "users_*"           # Only matching tables
atlas schema inspect --env <name> --exclude "*_backup"          # Skip matching tables
atlas schema inspect --env <name> --exclude "*[type=trigger]"   # Skip triggers

# Open visual ERD in browser
atlas schema inspect --env <name> -w
```

### 2. Schema Comparison (Diff)

Compare any two schema states:

```bash
# Compare current state to desired schema
atlas schema diff --env <name>

# Compare specific sources
atlas schema diff --env <name> --from file://migrations --to file://schema.hcl
```

### 3. Migration Generation

Generate migrations from schema changes:

```bash
# Generate migration from schema diff
atlas migrate diff --env <name> "add_users_table"

# With explicit parameters
atlas migrate diff \
  --dir file://migrations \
  --dev-url docker://postgres/15/dev \
  --to file://schema.hcl \
  "add_users_table"
```

### 4. Schema Validation

**Validate schema definitions before generating migrations:**

```bash
# Validate schema syntax and semantics
atlas schema validate --env <name>

# Validate against dev database
atlas schema validate --dev-url docker://postgres/15/dev --url file://schema.hcl
```

If valid, exits successfully. If invalid, prints detailed error (unresolved references, syntax issues, unsupported attributes).

### 5. Migration Linting

```bash
atlas migrate lint --env <name> --latest 1    # Lint latest migration
atlas migrate lint --env ci                   # Lint since git branch
atlas schema lint --env <name>                # Check schema policies
```

Fixing lint issues:
- Unapplied migrations: Edit file, then `atlas migrate hash --env <name>`
- Applied migrations: Create corrective migration (never edit directly)

### 6. Migration Testing

```bash
atlas migrate test --env <name>               # Requires Atlas Pro
atlas whoami                                  # Check login status first
```

### 7. Applying Migrations

```bash
atlas migrate apply --env <name> --dry-run    # Always preview first
atlas migrate apply --env <name>              # Apply
atlas migrate status --env <name>             # Verify
```

## Standard Workflow

1. `atlas schema inspect --env <name>` - Understand current state
2. Edit schema files
3. `atlas schema validate --env <name>` - Check syntax
4. `atlas migrate diff --env <name> "change_name"` - Generate migration
5. `atlas migrate lint --env <name> --latest 1` - Validate
6. `atlas migrate test --env <name>` - Test (Pro)
7. If issues: edit migration, then `atlas migrate hash`
8. `atlas migrate apply --env <name> --dry-run` then apply

## Schema Sources

### HCL Schema
```hcl
data "hcl_schema" "<name>" {
  path = "schema.hcl"
}
```

### External Schema (ORM Integration)
```hcl
data "external_schema" "drizzle" {
  program = ["npx", "drizzle-kit", "export"]
}

data "external_schema" "django" {
  program = ["python", "manage.py", "atlas-provider-django", "--dialect", "postgresql"]
}
```

### Composite Schema (Pro)
```hcl
data "composite_schema" "app" {
  schema "users" {
    url = data.external_schema.auth_service.url
  }
  schema "graph" {
    url = "ent://ent/schema"
  }
}
```

## Troubleshooting

```bash
# Check installation and login
atlas version
atlas whoami

# Repair migration integrity after manual edits
atlas migrate hash --env <name>
```

**Missing driver error**: Ensure `--url` or `--dev-url` is correctly specified.

## Key Rules

1. Read `atlas.hcl` first - use environment names from config
2. Never hardcode credentials - use `getenv()`
3. Run `atlas schema validate` after schema edits
4. Always lint before applying migrations
5. Always dry-run before applying
6. Run `atlas migrate hash` after editing migration files
7. Write migration tests for data migrations
8. Write schema tests for complex logic (functions, triggers, procedures)
9. Check `atlas whoami` before Pro features
10. Never ignore lint errors

## Documentation

- https://atlasgo.io/docs
- https://atlasgo.io/cli-reference
- https://atlasgo.io/concepts/dev-database
