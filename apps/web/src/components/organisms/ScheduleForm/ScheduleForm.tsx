"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { useUpdateSalesOrderSchedule } from "@/features/sales-orders/hooks";
import { scheduleFormSchema, ScheduleFormValues } from "@/features/sales-orders/schemas";
import { SalesOrder } from "@/features/sales-orders/types";
import { setFormApiError } from "@/lib/form-errors";

export const ScheduleForm = ({ order }: { order: SalesOrder }) => {
  const updateSchedule = useUpdateSalesOrderSchedule(order.id);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
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
    clearErrors("root.server");
    try {
      await updateSchedule.mutateAsync(values);
    } catch (error) {
      setFormApiError<ScheduleFormValues>({
        error,
        fallback: "Nao foi possivel atualizar o agendamento.",
        fieldMap: {
          deliveryDate: {
            field: "deliveryDate",
            message: "Data de entrega invalida."
          },
          deliveryWindowStart: {
            field: "deliveryWindowStart",
            message: "Inicio da janela invalido."
          },
          deliveryWindowEnd: {
            field: "deliveryWindowEnd",
            message: "Fim da janela invalido."
          }
        },
        setError
      });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid min-w-0 max-w-full gap-4 rounded-md border border-line bg-white p-5"
    >
      <h2 className="text-base font-semibold text-ink">Agendamento</h2>
      <FormField label="Data de entrega" error={errors.deliveryDate?.message}>
        <Input type="date" {...register("deliveryDate")} />
      </FormField>
      <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
      {errors.root?.server?.message ? (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-danger">
          {errors.root.server.message}
        </div>
      ) : null}
      <Button type="submit" disabled={updateSchedule.isPending}>
        {updateSchedule.isPending ? "Salvando..." : "Salvar agendamento"}
      </Button>
    </form>
  );
};
