"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  transportTypeFormSchema,
  TransportTypeFormValues
} from "@/features/transport-types/schemas";
import { setFormApiError } from "@/lib/form-errors";

const emptyForm: TransportTypeFormValues = {
  name: "",
  active: true
};

const TransportTypesPage = () => {
  const transportTypesQuery = useTransportTypes();
  const createTransportType = useCreateTransportType();
  const updateTransportType = useUpdateTransportType();
  const [editingTransportType, setEditingTransportType] = useState<TransportType | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<TransportTypeFormValues>({
    resolver: zodResolver(transportTypeFormSchema),
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
        fallback: "Nao foi possivel salvar o tipo de transporte.",
        fieldMap: {
          name: {
            field: "name",
            message: "Nome ja cadastrado."
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
      title="Tipos de Transporte"
      description="Cadastro, consulta e edicao das modalidades de transporte."
    >
      <CrudPageLayout
        form={
          <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4">
            <h2 className="text-base font-semibold text-ink">
              {editingTransportType ? "Editar transporte" : "Novo transporte"}
            </h2>
            <FormField label="Nome" error={errors.name?.message}>
              <Input aria-invalid={Boolean(errors.name)} {...register("name")} />
            </FormField>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" {...register("active")} />
              Ativo
            </label>
            {errors.root?.server?.message ? (
              <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
                {errors.root.server.message}
              </div>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={createTransportType.isPending || updateTransportType.isPending}>
                Salvar
              </Button>
              {editingTransportType ? (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
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
