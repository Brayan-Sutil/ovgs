import { OrderForm } from "@/components/organisms/OrderForm";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

const NewOrderPage = () => {
  return (
    <DashboardLayout
      title="Criar Ordem de Venda"
      description="Associacao de cliente, transporte autorizado e itens cadastrados."
    >
      <OrderForm />
    </DashboardLayout>
  );
};

export default NewOrderPage;
