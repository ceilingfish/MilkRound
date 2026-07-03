using System.Text.Json.Serialization;
using Dapper;
using Microsoft.AspNetCore.Builder;
using MilkRound.Abstractions.Commands;
using MilkRound.Abstractions.Data;
using MilkRound.Abstractions.Queries;
using MilkRound.Application.Handlers.Commands;
using MilkRound.Application.Handlers.Queries;
using MilkRound.Application.Models.Commands;
using MilkRound.Application.Models.Queries;
using MilkRound.Data.PostgreSql.Repositories;
using MilkRound.DataContracts.Responses;
using Scalar.AspNetCore;

// Dapper maps Postgres' snake_case function output columns (e.g. supplier_id) onto the
// PascalCase properties of the row records used throughout Data.PostgreSql (e.g. SupplierId).
DefaultTypeMap.MatchNamesWithUnderscores = true;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Reads ConnectionStrings:MilkRoundDb from configuration. When run under the Aspire AppHost this
// is injected as the ConnectionStrings__MilkRoundDb environment variable; standalone, set it via
// appsettings.json/user-secrets/env var using the same key.
builder.AddNpgsqlDataSource("MilkRoundDb");

builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();

builder.Services.AddScoped<
    IQueryHandler<ValidateCodeQuery, ValidateCodeResponse?>,
    ValidateCodeQueryHandler>();
builder.Services.AddScoped<
    IQueryHandler<CheckServiceAreaQuery, CheckServiceAreaResult>,
    CheckServiceAreaQueryHandler>();

builder.Services.AddScoped<
    ICommandHandler<CreateCustomerCommand, CreateCustomerCommandResult>,
    CreateCustomerCommandHandler>();
builder.Services.AddScoped<
    ICommandHandler<CreateSubscriptionCommand, CreateSubscriptionCommandResult>,
    CreateSubscriptionCommandHandler>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("DevAllowAll", policy =>
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevAllowAll");
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        //options.EndpointPathPrefix = "/scalar";
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
