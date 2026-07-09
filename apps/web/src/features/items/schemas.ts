import { z } from "zod";

export const itemFormSchema = z.object({
  sku: z.string().trim().min(2, "Informe ao menos 2 caracteres"),
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres"),
  description: z.string().trim().optional()
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
