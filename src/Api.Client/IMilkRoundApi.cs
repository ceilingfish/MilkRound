using MilkRound.DataContracts.Models;
using MilkRound.DataContracts.Requests;
using MilkRound.DataContracts.Responses;
using Refit;

namespace MilkRound.Api.Client;

/// <summary>
/// Refit client interface for the MilkRound API.
/// </summary>
public interface IMilkRoundApi
{
    // Auth endpoints
    [Post("/Auth/Signup")]
    Task<SignupResponse> SignupAsync([Body] SignupRequest request);

    [Get("/Auth/Callback")]
    Task CallbackAsync(string code, string? state = null);

    [Get("/Auth/Authorized")]
    Task<bool> IsAuthorizedAsync();

    // Supplier endpoints
    [Get("/Supplier/{id}")]
    Task<SupplierInfo> GetSupplierInfoAsync(Guid id);

    [Get("/Supplier/{id}/DeliverySchedule")]
    Task<DeliveryScheduleResponse> GetSupplierDeliveryScheduleAsync(Guid id);

    [Get("/Supplier/{id}/Items")]
    Task<SupplierItemsResponse> GetSupplierItemsAsync(
        Guid id,
        Guid? deliveryScheduleId = null,
        string? query = null);

    [Get("/Supplier/{id}/PlannedDeliveries")]
    Task<PlannedDeliveriesResponse> GetPlannedDeliveriesAsync(Guid id);

    // PlannedDeliveries endpoints
    [Get("/PlannedDeliveries/Next")]
    Task<Delivery> GetNextDeliveryAsync();

    [Post("/PlannedDeliveries/{id}/Items")]
    Task<ModifyDeliveryResponse> AddItemToPlannedDeliveryAsync(Guid id, [Body] AddItemRequest request);

    [Delete("/PlannedDeliveries/{id}/Items/{itemId}")]
    Task RemoveItemFromPlannedDeliveryAsync(Guid id, Guid itemId);

    [Post("/PlannedDeliveries/{id}/Cancel")]
    Task<ModifyDeliveryResponse> CancelPlannedDeliveryAsync(Guid id);

    // DeliverySchedules endpoints
    [Post("/DeliverySchedules/{id}/Items")]
    Task<ModifyDeliveryResponse> AddItemToDeliveryScheduleAsync(Guid id, [Body] AddItemRequest request);

    [Delete("/DeliverySchedules/{id}/Items/{itemId}")]
    Task RemoveItemFromDeliveryScheduleAsync(Guid id, Guid itemId);

    [Post("/DeliverySchedules/{id}/Cancel")]
    Task<ModifyDeliveryResponse> CancelDeliveryScheduleAsync(Guid id);
}
