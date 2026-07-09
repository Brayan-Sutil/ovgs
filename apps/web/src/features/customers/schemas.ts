import { z } from "zod";
import { defaultLocale, messages } from "@/i18n/messages";

type ValidationMessages = (typeof messages)[typeof defaultLocale]["validation"];

export const createCustomerFormSchema = (validation: ValidationMessages) => {
  const optionalEmailSchema = z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      validation.invalidEmail
    );

  return z.object({
    name: z.string().trim().min(2, validation.minTwoCharacters),
    document: z.string().trim().min(5, validation.invalidDocument),
    email: optionalEmailSchema,
    authorizedTransportTypeIds: z.array(z.string()).default([])
  });
};

export const customerFormSchema = createCustomerFormSchema(messages[defaultLocale].validation);

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
