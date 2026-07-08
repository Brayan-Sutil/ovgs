import { Badge } from "@/components/atoms/Badge";
import { SalesOrderStatus } from "@/features/sales-orders/types";

const statusTone: Record<SalesOrderStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  CRIADA: "neutral",
  PLANEJADA: "info",
  AGENDADA: "warning",
  EM_TRANSPORTE: "warning",
  ENTREGUE: "success"
};

export const StatusBadge = ({ status }: { status: SalesOrderStatus }) => {
  return <Badge tone={statusTone[status]}>{status.replace("_", " ")}</Badge>;
};
