import Link from "next/link";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { SalesOrder } from "@/features/sales-orders/types";

type OrdersTableProps = {
  orders: SalesOrder[];
  loading?: boolean;
};

export const OrdersTable = ({ orders, loading }: OrdersTableProps) => {
  if (loading) {
    return <div className="rounded-md border border-line bg-white p-5 text-sm">Carregando ordens...</div>;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Nenhuma Ordem de Venda encontrada"
        description="Ajuste os filtros ou crie uma nova Ordem de Venda."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Codigo</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Transporte</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Entrega</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-semibold text-ink">{order.code}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer.name}</td>
                <td className="px-4 py-3 text-slate-700">{order.transportType.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm font-semibold text-brand hover:text-teal-800"
                  >
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
