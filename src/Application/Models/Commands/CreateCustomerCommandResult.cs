namespace MilkRound.Application.Models.Commands;

public enum CreateCustomerOutcome
{
    Created,
    SupplierCodeNotFound,
    OutOfServiceArea,
    DuplicateAddress
}

public record CreateCustomerCommandResult(CreateCustomerOutcome Outcome, Guid? CustomerId);
