using Microsoft.AspNetCore.Mvc;
using MilkRound.DataContracts.Requests;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Api.Service.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("Signup")]
    [ProducesResponseType(typeof(SignupResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        // TODO: Implement signup with Auth0 integration
        return NotFound();
    }

    [HttpGet("Callback")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string? state = null)
    {
        // TODO: Implement Auth0 callback
        return Unauthorized();
    }

    [HttpGet("Authorized")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Authorized()
    {
        // TODO: Implement session check
        return Unauthorized();
    }
}
