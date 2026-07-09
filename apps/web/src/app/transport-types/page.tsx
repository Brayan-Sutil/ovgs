"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { TransportType } from "@/features/sales-orders/types";
import {
  useCreateTransportType,
  useTransportTypes,
  useUpdateTransportType
} from "@/features/transport-types/hooks";
import {
  createTransportTypeFormSchema,
  TransportTypeFormValues
} from "@/features/transport-types/schemas";
import { messages } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";
import { setFormApiError } from "@/lib/form-errors";

const emptyForm: TransportTypeFormValues = {
  name: "",
  active: true
};

const TransportTypesPage = () => {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tTransportTypes = useTranslations("transportTypes");
  const { isReady, session } = useAuth();
  const isCompany = isCompanySession(session);
  const { locale } = useAppLocale();
  const transportTypesQuery = useTransportTypes(isReady && isCompany);
  const createTransportType = useCreateTransportType();
  const updateTransportType = useUpdateTransportType();
  const [editingTransportType, setEditingTransportType] = useState<TransportType | null>(null);
  const formSchema = useMemo(
    () => createTransportTypeFormSchema(messages[locale].validation),
    [locale]
  );
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<TransportTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyForm
  });

  useEffect(() => {
    if (!editingTransportType) {
      reset(emptyForm);
      clearErrors();
      return;
    }

    reset({
      name: editingTransportType.name,
      active: editingTransportType.active
    });
    clearErrors();
  }, [clearErrors, editingTransportType, reset]);

  const submit = async (values: TransportTypeFormValues) => {
    clearErrors();
    try {
      if (editingTransportType) {
        await updateTransportType.mutateAsync({
          id: editingTransportType.id,
          payload: values
        });
      } else {
        await createTransportType.mutateAsync(values);
      }
      setEditingTransportType(null);
      reset(emptyForm);
    } catch (error) {
      setFormApiError<TransportTypeFormValues>({
        error,
        fallback: tErrors("saveTransportType"),
        fieldMap: {
          name: {
            field: "name",
            message: tErrors("duplicateTransportName")
          }
        },
        setError
      });
    }
  };

  const cancelEdit = () => {
    setEditingTransportType(null);
    reset(emptyForm);
    clearErrors();
  };

  return (
    <DashboardLayout
      title={tTransportTypes("title")}
      description={tTransportTypes("description")}
    >
      <CrudPageLayout
        form={
          <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">
              {editingTransportType ? tTransportTypes("edit") : tTransportTypes("new")}
            </h2>
            <FormField label={tTransportTypes("name")} error={errors.name?.message}>
              <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
            </FormField>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" {...register("active")} />
              {tCommon("active")}
            </label>
            {errors.root?.server?.message ? (
              <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
                {errors.root.server.message}
              </div>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={createTransportType.isPending || updateTransportType.isPending}>
                {tCommon("save")}
              </Button>
              {editingTransportType ? (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  {tCommon("cancel")}
                </Button>
              ) : null}
            </div>
          </form>
        }
        list={
          <div>
            <h2 className="text-base font-semibold text-ink">{tTransportTypes("registered")}</h2>

            <div className="mt-4 divide-y divide-line rounded-md border border-line md:hidden">
              {transportTypesQuery.data?.map((transportType) => (
                <div key={transportType.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <div className="break-words text-sm font-semibold text-ink">
                      {transportType.name}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
                      {transportType.active ? tCommon("active") : tCommon("inactive")}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="shrink-0"
                    onClick={() => setEditingTransportType(transportType)}
                  >
                    {tCommon("edit")}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{tTransportTypes("name")}</th>
                    <th className="px-3 py-2">{tTransportTypes("situation")}</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {transportTypesQuery.data?.map((transportType) => (
                    <tr key={transportType.id}>
                      <td className="px-3 py-2 font-semibold">{transportType.name}</td>
                      <td className="px-3 py-2">
                        {transportType.active ? tCommon("active") : tCommon("inactive")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button variant="secondary" onClick={() => setEditingTransportType(transportType)}>
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

export default TransportTypesPage;
