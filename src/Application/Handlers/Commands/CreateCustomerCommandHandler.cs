using MilkRound.Abstractions.Commands;
using MilkRound.Abstractions.Data;
using MilkRound.Application.Helpers;
using MilkRound.Application.Models.Commands;
using DataOutcome = MilkRound.Abstractions.Data.CreateCustomerOutcome;
using Outcome = MilkRound.Application.Models.Commands.CreateCustomerOutcome;

namespace MilkRound.Application.Handlers.Commands;

/// <summary>
/// Resolves the supplier (by signup code) and the matching rota (by postcode), then creates the
/// customer and links it to that rota.
/// </summary>
public class CreateCustomerCommandHandler(
    ISupplierRepository supplierRepository,
    ICustomerRepository customerRepository)
    : ICommandHandler<CreateCustomerCommand, CreateCustomerCommandResult>
{
    public async Task<CreateCustomerCommandResult> HandleAsync(
        CreateCustomerCommand command,
        CancellationToken cancellationToken = default)
    {
        var supplier = await supplierRepository.FindBySignupKeyAsync(command.SupplierCode, cancellationToken);
        if (supplier is null)
        {
            return new CreateCustomerCommandResult(Outcome.SupplierCodeNotFound, null);
        }

        var outwardCode = PostcodeHelper.ToOutwardCode(command.Postcode);
        var rota = await supplierRepository.FindMatchingRotaForPostcodeAsync(
            supplier.SupplierId,
            outwardCode,
            cancellationToken);

        if (rota is null)
        {
            return new CreateCustomerCommandResult(Outcome.OutOfServiceArea, null);
        }

        var result = await customerRepository.CreateCustomerAsync(
            new CreateCustomerParams(
                supplier.SupplierId,
                rota.RotaId,
                command.Name,
                command.Flat,
                command.Line1,
                command.Line2,
                command.Postcode,
                command.Notes,
                command.Latitude,
                command.Longitude),
            cancellationToken);

        return result.Outcome switch
        {
            DataOutcome.Created => new CreateCustomerCommandResult(Outcome.Created, result.PublicId),
            DataOutcome.DuplicateAddress => new CreateCustomerCommandResult(Outcome.DuplicateAddress, null),
            _ => throw new InvalidOperationException($"Unexpected customer creation outcome: {result.Outcome}"),
        };
    }
}
