"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/auth/provider";
import { isCompanySession } from "@/auth/session";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCreateItem, useItems } from "@/features/items/hooks";
import { createItemFormSchema, ItemFormValues } from "@/features/items/schemas";
import { messages } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";
import { setFormApiError } from "@/lib/form-errors";

const emptyForm: ItemFormValues = {
  sku: "",
  name: "",
  description: ""
};

const ItemsPage = () => {
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tItems = useTranslations("items");
  const { isReady, session } = useAuth();
  const isCompany = isCompanySession(session);
  const { locale } = useAppLocale();
  const itemsQuery = useItems(isReady && isCompany);
  const createItem = useCreateItem();
  const formSchema = useMemo(() => createItemFormSchema(messages[locale].validation), [locale]);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyForm
  });

  const submit = async (values: ItemFormValues) => {
    clearErrors();
    try {
      await createItem.mutateAsync({
        sku: values.sku,
        name: values.name,
        description: values.description || undefined
      });
      reset(emptyForm);
    } catch (error) {
      setFormApiError<ItemFormValues>({
        error,
        fallback: tErrors("createItem"),
        fieldMap: {
          sku: {
            field: "sku",
            message: tErrors("duplicateSku")
          }
        },
        setError
      });
    }
  };

  return (
    <DashboardLayout title={tItems("title")} description={tItems("description")}>
      <CrudPageLayout
        form={
          <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">{tItems("new")}</h2>
            <FormField label={tItems("sku")} error={errors.sku?.message}>
              <Input aria-invalid={Boolean(errors.sku)} {...register("sku")} />
            </FormField>
            <FormField label={tItems("name")} error={errors.name?.message}>
              <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
            </FormField>
            <FormField label={tItems("descriptionField")} error={errors.description?.message}>
              <Input aria-invalid={Boolean(errors.description)} {...register("description")} />
            </FormField>
            {errors.root?.server?.message ? (
              <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
                {errors.root.server.message}
              </div>
            ) : null}
            <Button type="submit" disabled={createItem.isPending}>
              {tCommon("save")}
            </Button>
          </form>
        }
        list={
          <div>
            <h2 className="text-base font-semibold text-ink">{tItems("registered")}</h2>

            <div className="mt-4 divide-y divide-line rounded-md border border-line md:hidden">
              {itemsQuery.data?.map((item) => (
                <div key={item.id} className="grid gap-3 p-3">
                  <div className="min-w-0">
                    <div className="break-words text-sm font-semibold text-ink">{item.name}</div>
                    <div className="mt-1 break-words text-xs font-semibold uppercase text-slate-500">
                      {item.sku}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase text-slate-500">
                      {tItems("descriptionField")}
                    </div>
                    <div className="mt-1 break-words text-sm text-slate-700">
                      {item.description ?? "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">{tItems("sku")}</th>
                    <th className="px-3 py-2">{tItems("name")}</th>
                    <th className="px-3 py-2">{tItems("descriptionField")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {itemsQuery.data?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 font-semibold">{item.sku}</td>
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.description ?? "-"}</td>
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

export default ItemsPage;
