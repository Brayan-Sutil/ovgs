import { z } from "zod";

const optionalEmailSchema = z
  .string()
  .trim()
  .refine(
    (value) => value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Informe um e-mail valido"
  );

export const customerFormSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres"),
  document: z.string().trim().min(5, "Informe um documento valido"),
  email: optionalEmailSchema,
  authorizedTransportTypeIds: z.array(z.string()).default([])
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
