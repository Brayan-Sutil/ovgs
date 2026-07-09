"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCreateCustomer, useCustomers, useUpdateCustomer } from "@/features/customers/hooks";
import { customerFormSchema, CustomerFormValues } from "@/features/customers/schemas";
import { Customer } from "@/features/sales-orders/types";
import { useTransportTypes } from "@/features/transport-types/hooks";
import { setFormApiError } from "@/lib/form-errors";

const emptyForm: CustomerFormValues = {
  name: "",
  document: "",
  email: "",
  authorizedTransportTypeIds: []
};

const CustomersPage = () => {
  const customersQuery = useCustomers();
  const transportTypesQuery = useTransportTypes();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: emptyForm
  });

  useEffect(() => {
    if (!editingCustomer) {
      reset(emptyForm);
      clearErrors();
      return;
    }

    reset({
      name: editingCustomer.name,
      document: editingCustomer.document,
      email: editingCustomer.email ?? "",
      authorizedTransportTypeIds: editingCustomer.authorizedTransportTypes.map(
        (authorization) => authorization.transportTypeId
      )
    });
    clearErrors();
  }, [clearErrors, editingCustomer, reset]);

  const submit = async (values: CustomerFormValues) => {
    clearErrors();
    const payload = {
      name: values.name,
      document: values.document,
      email: values.email || undefined,
      authorizedTransportTypeIds: values.authorizedTransportTypeIds
    };

    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({ id: editingCustomer.id, payload });
      } else {
        await createCustomer.mutateAsync(payload);
      }
      setEditingCustomer(null);
      reset(emptyForm);
    } catch (error) {
      setFormApiError<CustomerFormValues>({
        error,
        fallback: "Nao foi possivel salvar o cliente.",
        fieldMap: {
          document: {
            field: "document",
            message: "Documento ja cadastrado."
          }
        },
        setError
      });
    }
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    reset(emptyForm);
    clearErrors();
  };

  return (
    <DashboardLayout title="Clientes" description="Cadastro, consulta e edicao de clientes.">
      <CrudPageLayout
        form={
          <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">
              {editingCustomer ? "Editar cliente" : "Novo cliente"}
            </h2>
            <FormField label="Nome" error={errors.name?.message}>
              <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
            </FormField>
            <FormField label="Documento" error={errors.document?.message}>
              <Input aria-invalid={Boolean(errors.document)} {...register("document")} />
            </FormField>
            <FormField label="E-mail" error={errors.email?.message}>
              <Input type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
            </FormField>
            <div className="grid gap-2">
              <div className="text-sm font-medium text-ink">Transportes autorizados</div>
              {transportTypesQuery.data?.map((transportType) => (
                <label key={transportType.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    value={transportType.id}
                    {...register("authorizedTransportTypeIds")}
                  />
                  {transportType.name}
                </label>
              ))}
              {errors.authorizedTransportTypeIds?.message ? (
                <span className="text-xs font-medium text-danger">
                  {errors.authorizedTransportTypeIds.message}
                </span>
              ) : null}
            </div>
            {errors.root?.server?.message ? (
              <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
                {errors.root.server.message}
              </div>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={createCustomer.isPending || updateCustomer.isPending}>
                Salvar
              </Button>
              {editingCustomer ? (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        }
        list={
          <div>
            <h2 className="text-base font-semibold text-ink">Clientes cadastrados</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Documento</th>
                    <th className="px-3 py-2">Transportes</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {customersQuery.data?.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-3 py-2 font-semibold">{customer.name}</td>
                      <td className="px-3 py-2">{customer.document}</td>
                      <td className="px-3 py-2">
                        {customer.authorizedTransportTypes
                          .map((authorization) => authorization.transportType.name)
                          .join(", ") || "-"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button variant="secondary" onClick={() => setEditingCustomer(customer)}>
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
      />
    </DashboardLayout>
  );
};

export default CustomersPage;
