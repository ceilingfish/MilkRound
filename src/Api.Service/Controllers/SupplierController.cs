using Microsoft.AspNetCore.Mvc;
using MilkRound.Abstractions.Queries;
using MilkRound.Application.Models.Queries;
using MilkRound.DataContracts.Models;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Api.Service.Controllers;

[ApiController]
[Route("Suppliers")]
public class SupplierController(
    IQueryHandler<FindSupplierByCodeQuery, FindSupplierByCodeResponse?> findByCode) : ControllerBase
{
    [HttpGet("FindByCode")]
    [ProducesResponseType(typeof(FindSupplierByCodeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> FindByCode([FromQuery] string code, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(code) || code.Length != 6)
            return BadRequest("code must be exactly 6 characters");

        var result = await findByCode.HandleAsync(new FindSupplierByCodeQuery(code), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SupplierInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSupplierInfo(Guid id)
    {
        // TODO: Implement with query handler
        return NotFound();
    }

    [HttpGet("{id}/DeliverySchedule")]
    [ProducesResponseType(typeof(DeliveryScheduleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDeliverySchedule(Guid id)
    {
        // TODO: Implement with query handler
        return NotFound();
    }

    [HttpGet("{id}/Items")]
    [ProducesResponseType(typeof(SupplierItemsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItems(
        Guid id,
        [FromQuery] Guid? deliveryScheduleId = null,
        [FromQuery] string? query = null)
    {
        // TODO: Implement with query handler
        return NotFound();
    }

    [HttpGet("{id}/PlannedDeliveries")]
    [ProducesResponseType(typeof(PlannedDeliveriesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPlannedDeliveries(Guid id)
    {
        // TODO: Implement with query handler
        return NotFound();
    }
}
