"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCreateCustomer, useCustomers, useUpdateCustomer } from "@/features/customers/hooks";
import { createCustomerFormSchema, CustomerFormValues } from "@/features/customers/schemas";
import { Customer } from "@/features/sales-orders/types";
import { useTransportTypes } from "@/features/transport-types/hooks";
import { messages } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";
import { setFormApiError } from "@/lib/form-errors";

const emptyForm: CustomerFormValues = {
  name: "",
  document: "",
  email: "",
  authorizedTransportTypeIds: []
};

const CustomersPage = () => {
  const tCommon = useTranslations("common");
  const tCustomers = useTranslations("customers");
  const tErrors = useTranslations("errors");
  const { isReady, session } = useAuth();
  const isCompany = isCompanySession(session);
  const { locale } = useAppLocale();
  const customersQuery = useCustomers(isReady && isCompany);
  const transportTypesQuery = useTransportTypes(isReady && isCompany);
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const formSchema = useMemo(
    () => createCustomerFormSchema(messages[locale].validation),
    [locale]
  );
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
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
        fallback: tErrors("saveCustomer"),
        fieldMap: {
          document: {
            field: "document",
            message: tErrors("duplicateDocument")
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
  const getAuthorizedTransportNames = (customer: Customer) =>
    customer.authorizedTransportTypes
      .map((authorization) => authorization.transportType.name)
      .join(", ") || "-";

  return (
    <DashboardLayout title={tCustomers("title")} description={tCustomers("description")}>
      <CrudPageLayout
        form={
          <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">
              {editingCustomer ? tCustomers("edit") : tCustomers("new")}
            </h2>
            <FormField label={tCustomers("name")} error={errors.name?.message}>
              <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
            </FormField>
            <FormField label={tCustomers("document")} error={errors.document?.message}>
              <Input aria-invalid={Boolean(errors.document)} {...register("document")} />
            </FormField>
            <FormField label={tCustomers("email")} error={errors.email?.message}>
              <Input type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
            </FormField>
            <div className="grid gap-2">
              <div className="text-sm font-medium text-ink">{tCustomers("authorizedTransports")}</div>
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
                {tCommon("save")}
              </Button>
              {editingCustomer ? (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  {tCommon("cancel")}
                </Button>
              ) : null}
            </div>
          </form>
        }
        list={
          <div>
            <h2 className="text-base font-semibold text-ink">{tCustomers("registered")}</h2>

            <div className="mt-4 divide-y divide-line rounded-md border border-line md:hidden">
              {customersQuery.data?.map((customer) => (
                <div key={customer.id} className="grid gap-3 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-semibold text-ink">{customer.name}</h3>
                      <p className="mt-1 break-words text-xs text-slate-500">{customer.document}</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      {tCommon("edit")}
                    </Button>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-500">
                      {tCustomers("transports")}
                    </div>
                    <div className="mt-1 break-words text-sm text-slate-700">
                      {getAuthorizedTransportNames(customer)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{tCustomers("name")}</th>
                    <th className="px-3 py-2">{tCustomers("document")}</th>
                    <th className="px-3 py-2">{tCustomers("transports")}</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {customersQuery.data?.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-3 py-2 font-semibold">{customer.name}</td>
                      <td className="px-3 py-2">{customer.document}</td>
                      <td className="px-3 py-2">
                        {getAuthorizedTransportNames(customer)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button variant="secondary" onClick={() => setEditingCustomer(customer)}>
                          {tCommon("edit")}
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
