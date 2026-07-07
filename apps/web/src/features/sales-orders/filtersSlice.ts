import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SalesOrderFilters, SalesOrderStatus } from "./types";

const initialState: SalesOrderFilters = {};

const salesOrdersFiltersSlice = createSlice({
  name: "salesOrdersFilters",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<SalesOrderStatus | undefined>) {
      state.status = action.payload;
    },
    setCustomerId(state, action: PayloadAction<string | undefined>) {
      state.customerId = action.payload;
    },
    setTransportTypeId(state, action: PayloadAction<string | undefined>) {
      state.transportTypeId = action.payload;
    },
    setDateFrom(state, action: PayloadAction<string | undefined>) {
      state.dateFrom = action.payload;
    },
    setDateTo(state, action: PayloadAction<string | undefined>) {
      state.dateTo = action.payload;
    },
    clearFilters() {
      return initialState;
    }
  }
});

export const {
  setStatus,
  setCustomerId,
  setTransportTypeId,
  setDateFrom,
  setDateTo,
  clearFilters
} = salesOrdersFiltersSlice.actions;

export const salesOrdersFiltersReducer = salesOrdersFiltersSlice.reducer;
