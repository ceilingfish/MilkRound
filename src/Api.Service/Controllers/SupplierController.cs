using Microsoft.AspNetCore.Mvc;
using MilkRound.DataContracts.Models;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Api.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class SupplierController : ControllerBase
{
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
