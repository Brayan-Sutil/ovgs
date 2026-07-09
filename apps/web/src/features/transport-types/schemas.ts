import { z } from "zod";

export const transportTypeFormSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres"),
  active: z.boolean().default(true)
});

export type TransportTypeFormValues = z.infer<typeof transportTypeFormSchema>;
