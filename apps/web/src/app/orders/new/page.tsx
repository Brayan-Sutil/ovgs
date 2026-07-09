"use client";

import { useTranslations } from "next-intl";
import { OrderForm } from "@/components/organisms/OrderForm";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

const NewOrderPage = () => {
  const tOrders = useTranslations("orders");

  return (
    <DashboardLayout
      title={tOrders("createTitle")}
      description={tOrders("createDescription")}
    >
      <OrderForm />
    </DashboardLayout>
  );
};

export default NewOrderPage;
