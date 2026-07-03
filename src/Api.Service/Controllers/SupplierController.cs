using Microsoft.AspNetCore.Mvc;
using MilkRound.Abstractions.Queries;
using MilkRound.Application.Models.Queries;
using MilkRound.DataContracts.Models;
using MilkRound.DataContracts.Requests;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Api.Service.Controllers;

[ApiController]
[Route("Suppliers")]
public class SupplierController(
    IQueryHandler<ValidateCodeQuery, ValidateCodeResponse?> validateCode,
    IQueryHandler<CheckServiceAreaQuery, CheckServiceAreaResult> checkServiceArea) : ControllerBase
{
    // ASP.NET Core MVC controllers don't ship a first-class [HttpQuery] attribute, but
    // AcceptVerbsAttribute (a sealed subclass of the internal HttpMethodAttribute) accepts an
    // arbitrary verb string and participates in action selection exactly like [HttpGet]/[HttpPost]
    // do. That's what lets this action respond to the custom HTTP QUERY method while still reading
    // its parameters from the request body like a POST would.
    [AcceptVerbs("QUERY", Route = "ValidateCode")]
    [ProducesResponseType(typeof(ValidateCodeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ValidateCode([FromBody] ValidateCodeRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Code) || request.Code.Length != 6)
            return BadRequest("code must be exactly 6 characters");

        var result = await validateCode.HandleAsync(new ValidateCodeQuery(request.Code), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("{id}/ServiceArea")]
    [ProducesResponseType(typeof(ServiceAreaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ServiceArea(Guid id, [FromQuery] string postcode, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(postcode))
            return BadRequest("postcode is required");

        var result = await checkServiceArea.HandleAsync(new CheckServiceAreaQuery(id, postcode), ct);
        if (!result.SupplierFound)
            return NotFound();

        return Ok(new ServiceAreaResponse(result.InRange, result.Eta));
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
