import { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
