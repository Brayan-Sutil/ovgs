"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { CrudPageLayout } from "@/components/templates/CrudPageLayout";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useCreateCustomer, useCustomers, useUpdateCustomer } from "@/features/customers/hooks";
import { Customer } from "@/features/sales-orders/types";
import { useTransportTypes } from "@/features/transport-types/hooks";

type CustomerFormState = {
  name: string;
  document: string;
  email: string;
  authorizedTransportTypeIds: string[];
};

const emptyForm: CustomerFormState = {
  name: "",
  document: "",
  email: "",
  authorizedTransportTypeIds: []
};

export default function CustomersPage() {
  const customersQuery = useCustomers();
  const transportTypesQuery = useTransportTypes();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!editingCustomer) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: editingCustomer.name,
      document: editingCustomer.document,
      email: editingCustomer.email ?? "",
      authorizedTransportTypeIds: editingCustomer.authorizedTransportTypes.map(
        (authorization) => authorization.transportTypeId
      )
    });
  }, [editingCustomer]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const payload = {
      name: form.name,
      document: form.document,
      email: form.email || undefined,
      authorizedTransportTypeIds: form.authorizedTransportTypeIds
    };

    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({ id: editingCustomer.id, payload });
        setMessage("Cliente atualizado.");
      } else {
        await createCustomer.mutateAsync(payload);
        setMessage("Cliente criado.");
      }
      setEditingCustomer(null);
      setForm(emptyForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar.");
    }
  }

  function toggleTransportType(transportTypeId: string) {
    setForm((currentForm) => ({
      ...currentForm,
      authorizedTransportTypeIds: currentForm.authorizedTransportTypeIds.includes(transportTypeId)
        ? currentForm.authorizedTransportTypeIds.filter((id) => id !== transportTypeId)
        : [...currentForm.authorizedTransportTypeIds, transportTypeId]
    }));
  }

  return (
    <DashboardLayout title="Clientes" description="Cadastro, consulta e edicao de clientes.">
      <CrudPageLayout
        form={
          <form onSubmit={submit} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">
              {editingCustomer ? "Editar cliente" : "Novo cliente"}
            </h2>
            <FormField label="Nome">
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </FormField>
            <FormField label="Documento">
              <Input
                value={form.document}
                onChange={(event) => setForm({ ...form, document: event.target.value })}
                required
              />
            </FormField>
            <FormField label="E-mail">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </FormField>
            <div className="grid gap-2">
              <div className="text-sm font-medium text-ink">Transportes autorizados</div>
              {transportTypesQuery.data?.map((transportType) => (
                <label key={transportType.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.authorizedTransportTypeIds.includes(transportType.id)}
                    onChange={() => toggleTransportType(transportType.id)}
                  />
                  {transportType.name}
                </label>
              ))}
            </div>
            {message ? <div className="rounded-md bg-surface p-3 text-sm">{message}</div> : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={createCustomer.isPending || updateCustomer.isPending}>
                Salvar
              </Button>
              {editingCustomer ? (
                <Button type="button" variant="secondary" onClick={() => setEditingCustomer(null)}>
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
}
