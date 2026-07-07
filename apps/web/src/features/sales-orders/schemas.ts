import { z } from "zod";

export const salesOrderFormSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  transportTypeId: z.string().min(1, "Selecione um tipo de transporte"),
  itemId: z.string().min(1, "Selecione um item"),
  quantity: z.coerce.number().int().min(1, "Informe uma quantidade valida")
});

export type SalesOrderFormValues = z.infer<typeof salesOrderFormSchema>;

export const scheduleFormSchema = z
  .object({
    deliveryDate: z.string().min(1, "Informe a data de entrega"),
    deliveryWindowStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horario invalido"),
    deliveryWindowEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horario invalido"),
    confirmed: z.boolean().default(false)
  })
  .refine((value) => value.deliveryWindowEnd > value.deliveryWindowStart, {
    message: "A janela final deve ser maior que a inicial",
    path: ["deliveryWindowEnd"]
  });

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
