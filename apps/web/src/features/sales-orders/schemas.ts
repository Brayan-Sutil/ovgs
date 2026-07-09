import { z } from "zod";
import { defaultLocale, messages } from "@/i18n/messages";

type ValidationMessages = (typeof messages)[typeof defaultLocale]["validation"];

export const createSalesOrderFormSchema = (validation: ValidationMessages) => {
  return z.object({
    customerId: z.string().min(1, validation.selectCustomer),
    transportTypeId: z.string().min(1, validation.selectTransportType),
    itemId: z.string().min(1, validation.selectItem),
    quantity: z.coerce.number().int().min(1, validation.invalidQuantity)
  });
};

export const salesOrderFormSchema = createSalesOrderFormSchema(messages[defaultLocale].validation);

export type SalesOrderFormValues = z.infer<typeof salesOrderFormSchema>;

export const createScheduleFormSchema = (validation: ValidationMessages) => {
  return z
    .object({
      deliveryDate: z.string().min(1, validation.deliveryDateRequired),
      deliveryWindowStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, validation.invalidTime),
      deliveryWindowEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, validation.invalidTime),
      confirmed: z.boolean().default(false)
    })
    .refine((value) => value.deliveryWindowEnd > value.deliveryWindowStart, {
      message: validation.deliveryWindowEndAfterStart,
      path: ["deliveryWindowEnd"]
    });
};

export const scheduleFormSchema = createScheduleFormSchema(messages[defaultLocale].validation);

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
