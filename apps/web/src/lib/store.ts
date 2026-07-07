import { configureStore } from "@reduxjs/toolkit";
import { salesOrdersFiltersReducer } from "@/features/sales-orders/filtersSlice";

export const store = configureStore({
  reducer: {
    salesOrdersFilters: salesOrdersFiltersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
