"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { OperationalFilters } from "@/components/organisms/OperationalFilters";
import { OrdersTable } from "@/components/organisms/OrdersTable";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCustomers } from "@/features/customers/hooks";
import { useSalesOrders } from "@/features/sales-orders/hooks";
import { useTransportTypes } from "@/features/transport-types/hooks";
import { useAppSelector } from "@/lib/redux-hooks";

const OrdersPage = () => {
  const tOrders = useTranslations("orders");
  const filters = useAppSelector((state) => state.salesOrdersFilters);
  const ordersQuery = useSalesOrders(filters);
  const customersQuery = useCustomers();
  const transportTypesQuery = useTransportTypes();

  return (
    <DashboardLayout
      title={tOrders("title")}
      description={tOrders("description")}
      action={
        <Link
          href="/orders/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          {tOrders("new")}
        </Link>
      }
    >
      <div className="grid gap-5">
        <OperationalFilters
          customers={customersQuery.data ?? []}
          transportTypes={transportTypesQuery.data ?? []}
        />
        <OrdersTable orders={ordersQuery.data ?? []} loading={ordersQuery.isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
