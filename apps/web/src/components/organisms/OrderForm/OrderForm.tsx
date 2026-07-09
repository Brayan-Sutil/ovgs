"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import { useCustomers } from "@/features/customers/hooks";
import { useItems } from "@/features/items/hooks";
import { useCreateSalesOrder } from "@/features/sales-orders/hooks";
import {
  createSalesOrderFormSchema,
  SalesOrderFormValues
} from "@/features/sales-orders/schemas";
import { messages } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";
import { setFormApiError } from "@/lib/form-errors";

type SelectedItem = {
  itemId: string;
  sku: string;
  name: string;
  quantity: number;
};

export const OrderForm = () => {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tOrderForm = useTranslations("orderForm");
  const router = useRouter();
  const { locale } = useAppLocale();
  const customersQuery = useCustomers();
  const itemsQuery = useItems();
  const createOrder = useCreateSalesOrder();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const formSchema = useMemo(
    () => createSalesOrderFormSchema(messages[locale].validation),
    [locale]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<SalesOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      transportTypeId: "",
      itemId: "",
      quantity: 1
    }
  });

  const customerId = watch("customerId");
  const transportTypeId = watch("transportTypeId");
  const itemId = watch("itemId");
  const quantity = watch("quantity");

  const selectedCustomer = customersQuery.data?.find((customer) => customer.id === customerId);
  const authorizedTransportTypes = useMemo(
    () =>
      selectedCustomer?.authorizedTransportTypes.map(
        (authorization) => authorization.transportType
      ) ?? [],
    [selectedCustomer]
  );

  useEffect(() => {
    if (
      transportTypeId &&
      !authorizedTransportTypes.some((transportType) => transportType.id === transportTypeId)
    ) {
      setValue("transportTypeId", "");
    }
  }, [authorizedTransportTypes, setValue, transportTypeId]);

  const addItem = () => {
    const item = itemsQuery.data?.find((currentItem) => currentItem.id === itemId);
    clearErrors(["itemId", "quantity"]);

    if (!item) {
      setError("itemId", {
        type: "manual",
        message: messages[locale].validation.selectItem
      });
      return;
    }

    if (!quantity || quantity < 1) {
      setError("quantity", {
        type: "manual",
        message: messages[locale].validation.invalidQuantity
      });
      return;
    }

    setSelectedItems((currentItems) => {
      const withoutCurrent = currentItems.filter((currentItem) => currentItem.itemId !== item.id);
      return [
        ...withoutCurrent,
        {
          itemId: item.id,
          sku: item.sku,
          name: item.name,
          quantity: Number(quantity)
        }
      ];
    });
    setValue("itemId", "");
    setValue("quantity", 1);
  };

  const onSubmit = async (values: SalesOrderFormValues) => {
    clearErrors();

    if (selectedItems.length === 0) {
      setError("itemId", {
        type: "manual",
        message: tErrors("noOrderItems")
      });
      return;
    }

    const isAuthorized = authorizedTransportTypes.some(
      (transportType) => transportType.id === values.transportTypeId
    );

    if (!isAuthorized) {
      setError("transportTypeId", {
        type: "manual",
        message: tErrors("unauthorizedTransport")
      });
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        customerId: values.customerId,
        transportTypeId: values.transportTypeId,
        items: selectedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity
        }))
      });
      router.push(`/orders/${order.id}`);
    } catch (error) {
      setFormApiError<SalesOrderFormValues>({
        error,
        fallback: tErrors("createOrder"),
        fieldMap: {
          customerId: {
            field: "customerId",
            message: tErrors("invalidCustomer")
          },
          transportTypeId: {
            field: "transportTypeId",
            message: tErrors("invalidTransportType")
          }
        },
        setError
      });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 rounded-md border border-line bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-ink">{tOrderForm("title")}</h2>
        <p className="mt-1 text-sm text-slate-600">{tOrderForm("description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={tOrderForm("customer")} error={errors.customerId?.message}>
          <Select {...register("customerId")}>
            <option value="">{tCommon("select")}</option>
            {customersQuery.data?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={tOrderForm("transportType")} error={errors.transportTypeId?.message}>
          <Select {...register("transportTypeId")} disabled={!selectedCustomer}>
            <option value="">{tCommon("select")}</option>
            {authorizedTransportTypes.map((transportType) => (
              <option key={transportType.id} value={transportType.id}>
                {transportType.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid gap-4 rounded-md border border-line p-4 md:grid-cols-[minmax(0,1fr)_160px_auto]">
        <FormField label={tOrderForm("item")} error={errors.itemId?.message}>
          <Select {...register("itemId")}>
            <option value="">{tCommon("select")}</option>
            {itemsQuery.data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.sku} - {item.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={tOrderForm("quantity")} error={errors.quantity?.message}>
          <Input type="number" min={1} {...register("quantity")} />
        </FormField>

        <div className="flex items-end">
          <Button type="button" variant="secondary" onClick={addItem}>
            <Plus size={16} aria-hidden />
            {tOrderForm("add")}
          </Button>
        </div>
      </div>

      {selectedItems.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">{tOrderForm("item")}</th>
                <th className="px-3 py-2">{tOrderForm("shortQuantity")}</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {selectedItems.map((item) => (
                <tr key={item.itemId}>
                  <td className="px-3 py-2 font-semibold">{item.sku}</td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.quantity}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-danger hover:bg-red-50"
                      onClick={() =>
                        setSelectedItems((currentItems) =>
                          currentItems.filter((currentItem) => currentItem.itemId !== item.itemId)
                        )
                      }
                      aria-label={tOrderForm("removeItem")}
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {errors.root?.server?.message ? (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
          {errors.root.server.message}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={createOrder.isPending}>
          {createOrder.isPending ? tOrderForm("creating") : tOrderForm("create")}
        </Button>
      </div>
    </form>
  );
};
