import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/http";

type FieldErrorTarget<TValues extends FieldValues> = {
  field: FieldPath<TValues>;
  message: string;
};

type SetFormApiErrorParams<TValues extends FieldValues> = {
  error: unknown;
  fallback: string;
  fieldMap?: Partial<Record<string, FieldErrorTarget<TValues>>>;
  setError: UseFormSetError<TValues>;
};

export const getFormErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error && error.message ? error.message : fallback;
};

export const setFormApiError = <TValues extends FieldValues>({
  error,
  fallback,
  fieldMap = {},
  setError
}: SetFormApiErrorParams<TValues>) => {
  const message = error instanceof ApiError ? fallback : getFormErrorMessage(error, fallback);

  if (error instanceof ApiError) {
    const fieldError = error.fields
      .map((field) => fieldMap[field])
      .find((target): target is FieldErrorTarget<TValues> => Boolean(target));

    if (fieldError) {
      setError(fieldError.field, {
        type: "server",
        message: fieldError.message
      });
      return;
    }
  }

  setError("root.server" as FieldPath<TValues>, {
    type: "server",
    message
  });
};
