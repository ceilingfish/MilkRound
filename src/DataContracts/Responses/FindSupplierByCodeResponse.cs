namespace MilkRound.DataContracts.Responses;

public record FindSupplierByCodeResponse(
    Guid SupplierId,
    string BusinessName
);
