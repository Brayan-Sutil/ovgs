"use client";

import { FormEvent, useEffect, useState } from "react";
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

const emptyForm = {
  name: "",
  active: true
};

const TransportTypesPage = () => {
  const transportTypesQuery = useTransportTypes();
  const createTransportType = useCreateTransportType();
  const updateTransportType = useUpdateTransportType();
  const [editingTransportType, setEditingTransportType] = useState<TransportType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!editingTransportType) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: editingTransportType.name,
      active: editingTransportType.active
    });
  }, [editingTransportType]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      if (editingTransportType) {
        await updateTransportType.mutateAsync({
          id: editingTransportType.id,
          payload: form
        });
        setMessage("Tipo de transporte atualizado.");
      } else {
        await createTransportType.mutateAsync(form);
        setMessage("Tipo de transporte criado.");
      }
      setEditingTransportType(null);
      setForm(emptyForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar.");
    }
  };

  return (
    <DashboardLayout
      title="Tipos de Transporte"
      description="Cadastro, consulta e edicao das modalidades de transporte."
    >
      <CrudPageLayout
        form={
          <form onSubmit={submit} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">
              {editingTransportType ? "Editar transporte" : "Novo transporte"}
            </h2>
            <FormField label="Nome">
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </FormField>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              Ativo
            </label>
            {message ? <div className="rounded-md bg-surface p-3 text-sm">{message}</div> : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={createTransportType.isPending || updateTransportType.isPending}>
                Salvar
              </Button>
              {editingTransportType ? (
                <Button type="button" variant="secondary" onClick={() => setEditingTransportType(null)}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        }
        list={
          <div>
            <h2 className="text-base font-semibold text-ink">Transportes cadastrados</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Situacao</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {transportTypesQuery.data?.map((transportType) => (
                    <tr key={transportType.id}>
                      <td className="px-3 py-2 font-semibold">{transportType.name}</td>
                      <td className="px-3 py-2">{transportType.active ? "Ativo" : "Inativo"}</td>
                      <td className="px-3 py-2 text-right">
                        <Button variant="secondary" onClick={() => setEditingTransportType(transportType)}>
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

export default TransportTypesPage;
