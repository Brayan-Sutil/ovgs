"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/molecules/EmptyState";
import { AuditEvent } from "@/features/sales-orders/types";
import { formatDateTime } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { useAppLocale } from "@/i18n/provider";

type AuditTimelineProps = {
  events: AuditEvent[];
  loading?: boolean;
};

export const AuditTimeline = ({ events, loading }: AuditTimelineProps) => {
  const tAudit = useTranslations("audit");
  const { locale } = useAppLocale();
  const auditActions = messages[locale].auditActions;

  if (loading) {
    return <div className="rounded-md border border-line bg-white p-5 text-sm">{tAudit("loading")}</div>;
  }

  if (events.length === 0) {
    return <EmptyState title={tAudit("emptyTitle")} description={tAudit("emptyDescription")} />;
  }

  return (
    <div className="min-w-0 rounded-md border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">{tAudit("title")}</h2>
      <ol className="mt-4 grid min-w-0 gap-4">
        {events.map((event) => (
          <li key={event.id} className="min-w-0 border-l-2 border-brand pl-4">
            <div className="text-sm font-semibold text-ink">
              {event.action in auditActions
                ? auditActions[event.action as keyof typeof auditActions]
                : event.action}
            </div>
            <div className="text-xs text-slate-500">
              {formatDateTime(event.createdAt, locale)}
            </div>
            <pre className="mt-2 max-h-40 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md bg-surface p-3 text-xs text-slate-700">
              {JSON.stringify(
                {
                  [tAudit("previous")]: event.previousState,
                  [tAudit("next")]: event.nextState
                },
                null,
                2
              )}
            </pre>
          </li>
        ))}
      </ol>
    </div>
  );
};
