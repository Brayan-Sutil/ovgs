"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/atoms/Button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  loading,
  onConfirm
}: ConfirmDialogProps) => {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-800">
          <AlertTriangle size={18} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          <Button className="mt-3" disabled={loading} onClick={onConfirm}>
            {loading ? "Processando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
