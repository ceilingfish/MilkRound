using Microsoft.AspNetCore.Builder;
using MilkRound.Abstractions.Queries;
using MilkRound.Application.Handlers.Queries;
using MilkRound.Application.Models.Queries;
using MilkRound.DataContracts.Responses;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddScoped<
    IQueryHandler<FindSupplierByCodeQuery, FindSupplierByCodeResponse?>,
    FindSupplierByCodeQueryHandler>();

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
