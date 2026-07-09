import { z } from "zod";
import { defaultLocale, messages } from "@/i18n/messages";

type ValidationMessages = (typeof messages)[typeof defaultLocale]["validation"];

export const createItemFormSchema = (validation: ValidationMessages) => {
  return z.object({
    sku: z.string().trim().min(2, validation.minTwoCharacters),
    name: z.string().trim().min(2, validation.minTwoCharacters),
    description: z.string().trim().optional()
  });
};

export const itemFormSchema = createItemFormSchema(messages[defaultLocale].validation);

export type ItemFormValues = z.infer<typeof itemFormSchema>;
