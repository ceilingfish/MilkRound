var builder = DistributedApplication.CreateBuilder(args);

// Explicit, deterministic local-dev credentials so that everything which talks to Postgres
// directly — the Atlas migration step below and mise.toml's `db:migrate` task — agrees on the
// same username/password, rather than Aspire generating a random one on each run.
const string dbUser = "user";
const string dbPassword = "password";
var postgresUser = builder.AddParameter("postgres-username", dbUser);
var postgresPassword = builder.AddParameter("postgres-password", dbPassword, secret: true);

// Pinned to host port 5432 so it stays compatible with mise.toml's DATABASE_URL
// (postgresql://user:password@localhost:5432/milkround) and the Atlas migration step, which
// both talk to Postgres directly rather than through Aspire service discovery.
var postgres = builder.AddPostgres("postgres", postgresUser, postgresPassword)
    .WithDataVolume()
    .WithHostPort(5432);

var milkRoundDb = postgres.AddDatabase("MilkRoundDb", "milkround");

// Apply the declarative schema in src/Schema with Atlas once Postgres is ready, before the API
// starts. Runs the local `atlas` binary (put on PATH by mise) against the pinned localhost URL,
// using an ephemeral Docker container as the dev database Atlas needs for diff planning.
// --auto-approve is required because the AppHost runs it non-interactively.
var migrationUrl = $"postgresql://{dbUser}:{dbPassword}@localhost:5432/milkround?sslmode=disable";
var migrations = builder.AddExecutable(
        "migrations",
        "atlas",
        workingDirectory: "../..",
        "schema", "apply",
        "--to", "file://src/Schema",
        "--url", migrationUrl,
        "--dev-url", "docker://postgres/16/dev",
        "--auto-approve")
    .WaitFor(milkRoundDb);

// Pin the API to predictable host ports (rather than the random ports in launchSettings.json)
// so tooling, the mobile UI, and manual testing always find it at the same address.
builder.AddProject<Projects.Api_Service>("api-service")
    .WithReference(milkRoundDb)
    .WaitForCompletion(migrations)
    .WithEndpoint("http", e => e.Port = 5080)
    .WithEndpoint("https", e => e.Port = 5443);

builder.Build().Run();
