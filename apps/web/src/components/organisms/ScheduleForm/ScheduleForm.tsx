"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { useUpdateSalesOrderSchedule } from "@/features/sales-orders/hooks";
import { scheduleFormSchema, ScheduleFormValues } from "@/features/sales-orders/schemas";
import { SalesOrder } from "@/features/sales-orders/types";

export const ScheduleForm = ({ order }: { order: SalesOrder }) => {
  const updateSchedule = useUpdateSalesOrderSchedule(order.id);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      deliveryDate: order.deliveryDate?.slice(0, 10) ?? "",
      deliveryWindowStart: order.deliveryWindowStart ?? "08:00",
      deliveryWindowEnd: order.deliveryWindowEnd ?? "12:00",
      confirmed: Boolean(order.scheduleConfirmedAt)
    }
  });

  const onSubmit = async (values: ScheduleFormValues) => {
    setMessage(null);
    try {
      await updateSchedule.mutateAsync(values);
      toast.success("Agendamento atualizado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-md border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">Agendamento</h2>
      <FormField label="Data de entrega" error={errors.deliveryDate?.message}>
        <Input type="date" {...register("deliveryDate")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Inicio da janela" error={errors.deliveryWindowStart?.message}>
          <Input type="time" {...register("deliveryWindowStart")} />
        </FormField>
        <FormField label="Fim da janela" error={errors.deliveryWindowEnd?.message}>
          <Input type="time" {...register("deliveryWindowEnd")} />
        </FormField>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input type="checkbox" className="h-4 w-4 rounded border-line text-brand" {...register("confirmed")} />
        Confirmar agendamento
      </label>
      {message ? <div className="rounded-md bg-surface p-3 text-sm text-slate-700">{message}</div> : null}
      <Button type="submit" disabled={updateSchedule.isPending}>
        {updateSchedule.isPending ? "Salvando..." : "Salvar agendamento"}
      </Button>
    </form>
  );
};
