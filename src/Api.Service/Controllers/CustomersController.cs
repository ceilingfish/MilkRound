using Microsoft.AspNetCore.Mvc;
using MilkRound.Abstractions.Commands;
using MilkRound.Application.Models.Commands;
using MilkRound.DataContracts.Requests;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Api.Service.Controllers;

[ApiController]
[Route("Customers")]
public class CustomersController(
    ICommandHandler<CreateCustomerCommand, CreateCustomerCommandResult> createCustomer,
    ICommandHandler<CreateSubscriptionCommand, CreateSubscriptionCommandResult> createSubscription) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(CreateCustomerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request, CancellationToken ct)
    {
        var command = new CreateCustomerCommand(
            request.SupplierCode,
            request.Name,
            request.Address.Flat,
            request.Address.Line1,
            request.Address.Line2,
            request.Address.Postcode,
            request.Address.Notes,
            request.Address.Latitude,
            request.Address.Longitude);

        var result = await createCustomer.HandleAsync(command, ct);

        return result.Outcome switch
        {
            CreateCustomerOutcome.Created => CreatedAtAction(
                nameof(Create),
                new { id = result.CustomerId },
                new CreateCustomerResponse(result.CustomerId!.Value)),
            CreateCustomerOutcome.SupplierCodeNotFound => NotFound(
                new ErrorResponse("Supplier code not found", "SupplierCodeNotFound")),
            CreateCustomerOutcome.OutOfServiceArea => Conflict(
                new ErrorResponse("Postcode is outside the supplier's service area", "OutOfServiceArea")),
            CreateCustomerOutcome.DuplicateAddress => Conflict(
                new ErrorResponse("A customer already exists at this address for this supplier", "DuplicateAddress")),
            _ => throw new InvalidOperationException($"Unexpected outcome: {result.Outcome}"),
        };
    }

    [HttpPost("{id}/Subscription")]
    [ProducesResponseType(typeof(CreateSubscriptionResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateSubscription(
        Guid id,
        [FromBody] CreateSubscriptionRequest request,
        CancellationToken ct)
    {
        var dayOverrides = request.DayOverrides?.ToDictionary(
            kvp => kvp.Key,
            IReadOnlyList<CreateSubscriptionBasketLine> (kvp) => kvp.Value
                .Select(i => new CreateSubscriptionBasketLine(i.ProductId, i.Quantity))
                .ToList());

        var command = new CreateSubscriptionCommand(
            id,
            request.DeliveryDays,
            request.DefaultBasket.Select(i => new CreateSubscriptionBasketLine(i.ProductId, i.Quantity)).ToList(),
            dayOverrides);

        var result = await createSubscription.HandleAsync(command, ct);

        return result.Outcome switch
        {
            CreateSubscriptionOutcome.Created => CreatedAtAction(
                nameof(CreateSubscription),
                new { id },
                new CreateSubscriptionResponse(result.ScheduleIds!, result.FirstDeliveryDate!.Value)),
            CreateSubscriptionOutcome.CustomerNotFound => NotFound(
                new ErrorResponse("Customer not found", "CustomerNotFound")),
            CreateSubscriptionOutcome.InvalidRequest => BadRequest(
                new ErrorResponse(result.ErrorMessage ?? "Invalid request", "InvalidRequest")),
            _ => throw new InvalidOperationException($"Unexpected outcome: {result.Outcome}"),
        };
    }
}
