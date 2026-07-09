import { z } from "zod";
import { defaultLocale, messages } from "@/i18n/messages";

type ValidationMessages = (typeof messages)[typeof defaultLocale]["validation"];

export const createTransportTypeFormSchema = (validation: ValidationMessages) => {
  return z.object({
    name: z.string().trim().min(2, validation.minTwoCharacters),
    active: z.boolean().default(true)
  });
};

export const transportTypeFormSchema = createTransportTypeFormSchema(
  messages[defaultLocale].validation
);

export type TransportTypeFormValues = z.infer<typeof transportTypeFormSchema>;
