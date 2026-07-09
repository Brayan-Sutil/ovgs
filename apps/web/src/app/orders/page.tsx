"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
import { OperationalFilters } from "@/components/organisms/OperationalFilters";
import { OrdersTable } from "@/components/organisms/OrdersTable";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCustomers } from "@/features/customers/hooks";
import { useSalesOrders } from "@/features/sales-orders/hooks";
import { useTransportTypes } from "@/features/transport-types/hooks";
import { useAppSelector } from "@/lib/redux-hooks";

const OrdersPage = () => {
  const tOrders = useTranslations("orders");
  const { isReady, session } = useAuth();
  const isCompany = isCompanySession(session);
  const filters = useAppSelector((state) => state.salesOrdersFilters);
  const ordersQuery = useSalesOrders(filters, Boolean(session));
  const customersQuery = useCustomers(isReady && isCompany);
  const transportTypesQuery = useTransportTypes(isReady && isCompany);

  return (
    <DashboardLayout
      title={tOrders("title")}
      description={tOrders("description")}
      action={isCompany ? (
        <Link
          href="/orders/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          {tOrders("new")}
        </Link>
      ) : undefined}
    >
      <div className="grid gap-5">
        {isCompany ? (
          <OperationalFilters
            customers={customersQuery.data ?? []}
            transportTypes={transportTypesQuery.data ?? []}
          />
        ) : null}
        <OrdersTable orders={ordersQuery.data ?? []} loading={!isReady || ordersQuery.isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
