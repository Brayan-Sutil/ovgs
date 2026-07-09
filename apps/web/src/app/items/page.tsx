"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCreateItem, useItems } from "@/features/items/hooks";
import { itemFormSchema, ItemFormValues } from "@/features/items/schemas";
import { setFormApiError } from "@/lib/form-errors";

const emptyForm: ItemFormValues = {
  sku: "",
  name: "",
  description: ""
};

const ItemsPage = () => {
  const itemsQuery = useItems();
  const createItem = useCreateItem();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
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
        fallback: "Nao foi possivel criar o item.",
        fieldMap: {
          sku: {
            field: "sku",
            message: "SKU ja cadastrado."
          }
        },
        setError
      });
    }
  };

  return (
    <DashboardLayout title="Itens" description="Cadastro e consulta de itens por SKU.">
      <CrudPageLayout
        form={
          <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">Novo item</h2>
            <FormField label="SKU" error={errors.sku?.message}>
              <Input aria-invalid={Boolean(errors.sku)} {...register("sku")} />
            </FormField>
            <FormField label="Nome" error={errors.name?.message}>
              <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
            </FormField>
            <FormField label="Descricao" error={errors.description?.message}>
              <Input aria-invalid={Boolean(errors.description)} {...register("description")} />
            </FormField>
            {errors.root?.server?.message ? (
              <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
                {errors.root.server.message}
              </div>
            ) : null}
            <Button type="submit" disabled={createItem.isPending}>
              Salvar
            </Button>
          </form>
        }
        list={
          <div>
            <h2 className="text-base font-semibold text-ink">Itens cadastrados</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Descricao</th>
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
