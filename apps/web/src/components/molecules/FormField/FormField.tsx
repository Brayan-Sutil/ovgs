import { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export const FormField = ({ label, error, children }: FormFieldProps) => {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
};
