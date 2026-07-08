import { EmptyState } from "@/components/molecules/EmptyState";
import { AuditEvent } from "@/features/sales-orders/types";

type AuditTimelineProps = {
  events: AuditEvent[];
  loading?: boolean;
};

export const AuditTimeline = ({ events, loading }: AuditTimelineProps) => {
  if (loading) {
    return <div className="rounded-md border border-line bg-white p-5 text-sm">Carregando auditoria...</div>;
  }

  if (events.length === 0) {
    return <EmptyState title="Sem eventos" description="Esta entidade ainda nao possui eventos de auditoria." />;
  }

  return (
    <div className="rounded-md border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">Auditoria</h2>
      <ol className="mt-4 grid gap-4">
        {events.map((event) => (
          <li key={event.id} className="border-l-2 border-brand pl-4">
            <div className="text-sm font-semibold text-ink">{event.action}</div>
            <div className="text-xs text-slate-500">
              {new Date(event.createdAt).toLocaleString("pt-BR")}
            </div>
            <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-surface p-3 text-xs text-slate-700">
              {JSON.stringify(
                {
                  anterior: event.previousState,
                  posterior: event.nextState
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
