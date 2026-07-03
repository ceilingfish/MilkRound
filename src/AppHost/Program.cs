var builder = DistributedApplication.CreateBuilder(args);

// Pinned to host port 5432 so it stays compatible with mise.toml's DATABASE_URL
// (postgresql://user:password@localhost:5432/milkround) and the `db:migrate` Atlas task, which
// both talk to Postgres directly rather than through Aspire service discovery.
var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithHostPort(5432);

var milkRoundDb = postgres.AddDatabase("MilkRoundDb", "milkround");

builder.AddProject<Projects.Api_Service>("api-service")
    .WithReference(milkRoundDb)
    .WaitFor(milkRoundDb);

builder.Build().Run();
