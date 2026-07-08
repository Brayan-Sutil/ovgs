"use client";

import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCreateItem, useItems } from "@/features/items/hooks";

const emptyForm = {
  sku: "",
  name: "",
  description: ""
};

const ItemsPage = () => {
  const itemsQuery = useItems();
  const createItem = useCreateItem();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      await createItem.mutateAsync({
        sku: form.sku,
        name: form.name,
        description: form.description || undefined
      });
      setForm(emptyForm);
      toast.success("Item criado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel criar o item.");
    }
  };

  return (
    <DashboardLayout title="Itens" description="Cadastro e consulta de itens por SKU.">
      <CrudPageLayout
        form={
          <form onSubmit={submit} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">Novo item</h2>
            <FormField label="SKU">
              <Input
                value={form.sku}
                onChange={(event) => setForm({ ...form, sku: event.target.value })}
                required
              />
            </FormField>
            <FormField label="Nome">
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </FormField>
            <FormField label="Descricao">
              <Input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </FormField>
            {message ? <div className="rounded-md bg-surface p-3 text-sm">{message}</div> : null}
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
