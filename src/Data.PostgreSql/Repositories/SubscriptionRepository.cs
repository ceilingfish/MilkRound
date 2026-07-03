using Dapper;
using MilkRound.Abstractions.Data;
using Npgsql;

namespace MilkRound.Data.PostgreSql.Repositories;

/// <summary>
/// Postgres-backed implementation of <see cref="ISubscriptionRepository"/>. Creating a subscription
/// spans one or more weekly delivery schedules; each step is a single stored function call from
/// src/Schema/Procedures via Dapper, all wrapped in one database transaction for atomicity.
/// </summary>
public class SubscriptionRepository(NpgsqlDataSource dataSource) : ISubscriptionRepository
{
    public async Task<IReadOnlyList<CreatedScheduleResult>> CreateSubscriptionAsync(
        CreateSubscriptionParams parameters,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);

        var results = new List<CreatedScheduleResult>();

        foreach (var schedule in parameters.Schedules)
        {
            var scheduleCommand = new CommandDefinition(
                "SELECT * FROM fn_create_delivery_schedule(@SupplierRotaId, @ScheduleType::ScheduleType, @DayOfWeek::DayOfWeek, @CreatedBy)",
                new
                {
                    parameters.SupplierRotaId,
                    ScheduleType = "Weekly",
                    schedule.DayOfWeek,
                    CreatedBy = CreatedBySentinel.Value,
                },
                transaction,
                cancellationToken: cancellationToken);
            var scheduleRow = await connection.QuerySingleAsync<ScheduleRow>(scheduleCommand);

            var subscriptionCommand = new CommandDefinition(
                "SELECT * FROM fn_create_subscription(@CustomerId, @DeliveryScheduleId, @CreatedBy)",
                new
                {
                    parameters.CustomerId,
                    DeliveryScheduleId = scheduleRow.ScheduleId,
                    CreatedBy = CreatedBySentinel.Value,
                },
                transaction,
                cancellationToken: cancellationToken);
            var subscriptionRow = await connection.QuerySingleAsync<SubscriptionRow>(subscriptionCommand);

            if (schedule.Items.Count > 0)
            {
                var itemsCommand = new CommandDefinition(
                    "SELECT * FROM fn_create_order_items_batch(@SubscriptionId, @SupplierItemIds, @Quantities, @CreatedBy)",
                    new
                    {
                        SubscriptionId = subscriptionRow.SubscriptionId,
                        SupplierItemIds = schedule.Items.Select(i => i.SupplierItemId).ToArray(),
                        Quantities = schedule.Items.Select(i => i.Quantity).ToArray(),
                        CreatedBy = CreatedBySentinel.Value,
                    },
                    transaction,
                    cancellationToken: cancellationToken);
                await connection.QueryAsync(itemsCommand);
            }

            results.Add(new CreatedScheduleResult(scheduleRow.PublicId, schedule.DayOfWeek));
        }

        await transaction.CommitAsync(cancellationToken);
        return results;
    }

    private sealed record ScheduleRow(long ScheduleId, Guid PublicId);

    private sealed record SubscriptionRow(long SubscriptionId);
}
