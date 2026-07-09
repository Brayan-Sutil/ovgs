"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  salesOrderFormSchema,
  SalesOrderFormValues
} from "@/features/sales-orders/schemas";
import { setFormApiError } from "@/lib/form-errors";

type SelectedItem = {
  itemId: string;
  sku: string;
  name: string;
  quantity: number;
};

export const OrderForm = () => {
  const router = useRouter();
  const customersQuery = useCustomers();
  const itemsQuery = useItems();
  const createOrder = useCreateSalesOrder();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<SalesOrderFormValues>({
    resolver: zodResolver(salesOrderFormSchema),
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
        message: "Selecione um item"
      });
      return;
    }

    if (!quantity || quantity < 1) {
      setError("quantity", {
        type: "manual",
        message: "Informe uma quantidade valida"
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
        message: "Adicione ao menos um item a Ordem de Venda."
      });
      return;
    }

    const isAuthorized = authorizedTransportTypes.some(
      (transportType) => transportType.id === values.transportTypeId
    );

    if (!isAuthorized) {
      setError("transportTypeId", {
        type: "manual",
        message: "Tipo de transporte nao autorizado para o cliente selecionado."
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
        fallback: "Nao foi possivel criar a ordem.",
        fieldMap: {
          customerId: {
            field: "customerId",
            message: "Cliente invalido."
          },
          transportTypeId: {
            field: "transportTypeId",
            message: "Tipo de transporte invalido."
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
        <h2 className="text-lg font-semibold text-ink">Nova Ordem de Venda</h2>
        <p className="mt-1 text-sm text-slate-600">Cliente, transporte autorizado e itens cadastrados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Cliente" error={errors.customerId?.message}>
          <Select {...register("customerId")}>
            <option value="">Selecione</option>
            {customersQuery.data?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Tipo de transporte" error={errors.transportTypeId?.message}>
          <Select {...register("transportTypeId")} disabled={!selectedCustomer}>
            <option value="">Selecione</option>
            {authorizedTransportTypes.map((transportType) => (
              <option key={transportType.id} value={transportType.id}>
                {transportType.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid gap-4 rounded-md border border-line p-4 md:grid-cols-[minmax(0,1fr)_160px_auto]">
        <FormField label="Item" error={errors.itemId?.message}>
          <Select {...register("itemId")}>
            <option value="">Selecione</option>
            {itemsQuery.data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.sku} - {item.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Quantidade" error={errors.quantity?.message}>
          <Input type="number" min={1} {...register("quantity")} />
        </FormField>

        <div className="flex items-end">
          <Button type="button" variant="secondary" onClick={addItem}>
            <Plus size={16} aria-hidden />
            Adicionar
          </Button>
        </div>
      </div>

      {selectedItems.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Qtd.</th>
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
                      aria-label="Remover item"
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
          {createOrder.isPending ? "Criando..." : "Criar Ordem de Venda"}
        </Button>
      </div>
    </form>
  );
};
