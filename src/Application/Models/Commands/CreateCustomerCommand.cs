namespace MilkRound.Application.Models.Commands;

public record CreateCustomerCommand(
    string SupplierCode,
    string Name,
    string? Flat,
    string Line1,
    string? Line2,
    string Postcode,
    string? Notes,
    decimal? Latitude,
    decimal? Longitude);
