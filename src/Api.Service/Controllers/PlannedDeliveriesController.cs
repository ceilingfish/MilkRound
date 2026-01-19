using Microsoft.AspNetCore.Mvc;
using MilkRound.DataContracts.Models;
using MilkRound.DataContracts.Requests;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Api.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class PlannedDeliveriesController : ControllerBase
{
    [HttpGet("Next")]
    [ProducesResponseType(typeof(Delivery), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetNext()
    {
        // TODO: Implement with query handler
        return NotFound();
    }

    [HttpPost("{id}/Items")]
    [ProducesResponseType(typeof(ModifyDeliveryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddItem(Guid id, [FromBody] AddItemRequest request)
    {
        // TODO: Implement with command handler
        return NotFound();
    }

    [HttpDelete("{id}/Items/{itemId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(Guid id, Guid itemId)
    {
        // TODO: Implement with command handler
        return NotFound();
    }

    [HttpPost("{id}/Cancel")]
    [ProducesResponseType(typeof(ModifyDeliveryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cancel(Guid id)
    {
        // TODO: Implement with command handler
        return NotFound();
    }
}
