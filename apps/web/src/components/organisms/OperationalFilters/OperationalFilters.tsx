"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import {
  clearFilters,
  setCustomerId,
  setDateFrom,
  setDateTo,
  setStatus,
  setTransportTypeId
} from "@/features/sales-orders/filtersSlice";
import {
  Customer,
  salesOrderStatuses,
  SalesOrderStatus,
  TransportType
} from "@/features/sales-orders/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";

type OperationalFiltersProps = {
  customers: Customer[];
  transportTypes: TransportType[];
};

export const OperationalFilters = ({ customers, transportTypes }: OperationalFiltersProps) => {
  const tCommon = useTranslations("common");
  const tFilters = useTranslations("filters");
  const tStatus = useTranslations("status");
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.salesOrdersFilters);

  return (
    <div className="grid gap-4 rounded-md border border-line bg-white p-5 md:grid-cols-2 xl:grid-cols-6">
      <FormField label={tFilters("status")}>
        <Select
          value={filters.status ?? ""}
          onChange={(event) =>
            dispatch(setStatus((event.target.value || undefined) as SalesOrderStatus | undefined))
          }
        >
          <option value="">{tCommon("all")}</option>
          {salesOrderStatuses.map((status) => (
            <option key={status} value={status}>
              {tStatus(status)}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={tFilters("customer")}>
        <Select
          value={filters.customerId ?? ""}
          onChange={(event) => dispatch(setCustomerId(event.target.value || undefined))}
        >
          <option value="">{tCommon("all")}</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={tFilters("transport")}>
        <Select
          value={filters.transportTypeId ?? ""}
          onChange={(event) => dispatch(setTransportTypeId(event.target.value || undefined))}
        >
          <option value="">{tCommon("all")}</option>
          {transportTypes.map((transportType) => (
            <option key={transportType.id} value={transportType.id}>
              {transportType.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={tFilters("dateFrom")}>
        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => dispatch(setDateFrom(event.target.value || undefined))}
        />
      </FormField>

      <FormField label={tFilters("dateTo")}>
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => dispatch(setDateTo(event.target.value || undefined))}
        />
      </FormField>

      <div className="flex items-end">
        <Button variant="secondary" className="w-full" onClick={() => dispatch(clearFilters())}>
          {tCommon("clear")}
        </Button>
      </div>
    </div>
  );
};
