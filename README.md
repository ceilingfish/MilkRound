# MilkRound

A milk-round delivery platform with a C# (.NET 10) backend, a PostgreSQL database, and a React Native (Expo) mobile app supporting both **customer** and **supplier** roles.

This README covers how to spin up the **database**, the **API**, and the **mobile application** locally.

## Architecture at a glance

| Component | Tech | Location |
| --- | --- | --- |
| Database | PostgreSQL, schema managed by [Atlas](https://atlasgo.io/) | `src/Schema` |
| API | ASP.NET Core (C# 10), hexagonal architecture | `src/Api.Service` |
| Orchestration | .NET Aspire AppHost (runs Postgres + API together) | `src/AppHost` |
| Mobile app | React Native + Expo (expo-router) | `src/MobileUi` |

## Prerequisites

Tooling is pinned via [mise](https://mise.jdx.dev/). Install mise, then from the repo root run:

```bash
mise install
```

This installs the pinned versions of:

- **.NET SDK** 10.0.102
- **Atlas** 1.0.0 (database schema migrations)
- **pnpm** 10.33.0 (mobile app package manager)
- **OpenTofu** / **Terragrunt** (infrastructure)

You will also need:

- **Docker** (Aspire uses it to run PostgreSQL in a container)
- The [Expo Go](https://expo.dev/go) app on your phone, or an iOS Simulator / Android Emulator, to run the mobile app

Handy: `mise tasks` lists all available tasks.

---

## 1. Database

The database schema (tables, functions, stored procedures, enums) is defined declaratively under `src/Schema` and applied to a real Postgres instance with [Atlas](https://atlasgo.io/). All application data access goes through the Postgres functions in `src/Schema/Procedures`.

### Local development — migrations run automatically

You don't need to run migrations by hand locally. The Aspire AppHost (see the API section below) starts a PostgreSQL container on host port **5432** and then runs Atlas as a `migrations` resource that applies `src/Schema` before the API starts:

```bash
mise run dev    # starts Postgres, runs Atlas migrations, then the API
```

This requires Docker to be running — Atlas uses an ephemeral Docker container (`docker://postgres/16/dev`) as its dev database for diff planning. You can watch the `migrations` resource logs in the Aspire dashboard.

### CI / hosted database — `mise run db:migrate`

The `db:migrate` task is how the **hosted** database is migrated from the CI pipeline. It applies `src/Schema` to whatever `DATABASE_URL` points at (we do not use Aspire in CI):

```bash
mise run db:migrate
```

which runs:

```bash
atlas schema apply --to src/Schema --url $DATABASE_URL --dev-url $DATABASE_DEV_URL
```

Both URLs come from the environment (`mise.toml` provides local defaults; CI should override them to target the hosted instance):

```
DATABASE_URL      = postgresql://user:password@localhost:5432/milkround
DATABASE_DEV_URL  = postgresql://user:password@localhost:5432/milkround_dev
```

> `DATABASE_DEV_URL` points to a scratch database (`milkround_dev`) that Atlas uses to plan migrations — it must exist and be empty.

---

## 2. API

The API is an ASP.NET Core service. It listens on:

- `http://localhost:59392`
- `https://localhost:59391`

(These match `EXPO_PUBLIC_API_URL` in the mobile app's `.env.local`.)

### Recommended: run via Aspire

The Aspire AppHost spins up **both** PostgreSQL and the API service together, wiring the connection string automatically:

```bash
mise run dev
```

This launches the Aspire dashboard and starts the `postgres`, `migrations`, and `api-service` resources in order — Postgres comes up, Atlas applies the schema, then the API starts against the migrated database. No manual migration step is needed locally.

### Alternative: run the API on its own

If you're supplying your own Postgres, you can build and run just the API:

```bash
mise run api:build    # dotnet build src/MilkRound.slnx
mise run api:run      # dotnet run --project src/Api.Service
```

The standalone API reads its connection string from `src/Api.Service/appsettings.Development.json`:

```
Host=localhost;Port=5432;Database=milkround;Username=user;Password=password
```

### Tests

```bash
mise run test
```

---

## 3. Mobile application

The Expo app lives in `src/MobileUi`.

### Configure the API endpoint

The API base URL is read from `src/MobileUi/.env.local`:

```
EXPO_PUBLIC_API_URL=http://localhost:59392
```

> Running on a **physical device**? `localhost` won't reach your machine. Change this to your computer's LAN IP, e.g. `http://192.168.1.20:59392`, and make sure your phone is on the same network.

### Install and run

```bash
cd src/MobileUi
pnpm install
```

Then start the Expo dev server (from the repo root or the app folder):

```bash
mise run dev:mobile      # runs `pnpm start` in src/MobileUi
```

Or run a specific target directly:

```bash
cd src/MobileUi
pnpm ios        # iOS Simulator
pnpm android    # Android Emulator
pnpm web        # browser
```

Scan the QR code from the dev server with Expo Go to run on a physical device.

---

## Full local stack — quick start

```bash
# 0. Install tooling
mise install

# 1. Start Postgres, apply migrations, and run the API (Aspire). Leave running.
#    Requires Docker to be running.
mise run dev

# 2. Start the mobile app (second terminal)
cd src/MobileUi && pnpm install && cd -
mise run dev:mobile
```

You should now have the database, API (`http://localhost:59392`), and the Expo app all running locally.
