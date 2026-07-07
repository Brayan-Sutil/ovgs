import {
  clearFilters,
  salesOrdersFiltersReducer,
  setCustomerId,
  setStatus
} from "./filtersSlice";

describe("salesOrdersFiltersSlice", () => {
  it("stores and clears operational filters", () => {
    const withStatus = salesOrdersFiltersReducer(undefined, setStatus("CRIADA"));
    const withCustomer = salesOrdersFiltersReducer(
      withStatus,
      setCustomerId("11111111-1111-4111-8111-111111111111")
    );

    expect(withCustomer).toEqual({
      status: "CRIADA",
      customerId: "11111111-1111-4111-8111-111111111111"
    });

    expect(salesOrdersFiltersReducer(withCustomer, clearFilters())).toEqual({});
  });
});
