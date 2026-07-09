import { SalesOrderStatus } from "@/features/sales-orders/types";

export const locales = ["pt", "en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const localeNames: Record<Locale, string> = {
  pt: "Portugues",
  en: "English",
  es: "Espanol"
};

export const dateLocales: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES"
};

export const isLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale);
};

export const messages = {
  pt: {
    metadata: {
      title: "OVGS",
      description: "Sistema de Gestao de Ordens de Venda"
    },
    language: {
      label: "Idioma"
    },
    common: {
      all: "Todos",
      open: "Abrir",
      save: "Salvar",
      saving: "Salvando...",
      cancel: "Cancelar",
      edit: "Editar",
      active: "Ativo",
      inactive: "Inativo",
      clear: "Limpar",
      select: "Selecione",
      processing: "Processando...",
      notAvailable: "-"
    },
    nav: {
      operation: "Operacao",
      orders: "Ordens",
      scheduling: "Agendamento",
      customers: "Clientes",
      transportTypes: "Transportes",
      items: "Itens"
    },
    status: {
      CRIADA: "Criada",
      PLANEJADA: "Planejada",
      AGENDADA: "Agendada",
      EM_TRANSPORTE: "Em transporte",
      ENTREGUE: "Entregue"
    } satisfies Record<SalesOrderStatus, string>,
    auditActions: {
      STATUS_CHANGED: "Status alterado",
      SALES_ORDER_CREATED: "Ordem de Venda criada",
      TRANSPORT_CHANGED: "Transporte alterado",
      SCHEDULE_UPDATED: "Agendamento atualizado",
      SHARE_LINK_CREATED: "Link de compartilhamento criado"
    },
    validation: {
      minTwoCharacters: "Informe ao menos 2 caracteres",
      invalidDocument: "Informe um documento valido",
      invalidEmail: "Informe um e-mail valido",
      invalidQuantity: "Informe uma quantidade valida",
      selectCustomer: "Selecione um cliente",
      selectTransportType: "Selecione um tipo de transporte",
      selectItem: "Selecione um item",
      deliveryDateRequired: "Informe a data de entrega",
      invalidTime: "Horario invalido",
      deliveryWindowEndAfterStart: "A janela final deve ser maior que a inicial"
    },
    errors: {
      genericOperation: "Nao foi possivel concluir a operacao",
      saveCustomer: "Nao foi possivel salvar o cliente.",
      duplicateDocument: "Documento ja cadastrado.",
      createItem: "Nao foi possivel criar o item.",
      duplicateSku: "SKU ja cadastrado.",
      saveTransportType: "Nao foi possivel salvar o tipo de transporte.",
      duplicateTransportName: "Nome ja cadastrado.",
      createOrder: "Nao foi possivel criar a ordem.",
      invalidCustomer: "Cliente invalido.",
      invalidTransportType: "Tipo de transporte invalido.",
      noOrderItems: "Adicione ao menos um item a Ordem de Venda.",
      unauthorizedTransport: "Tipo de transporte nao autorizado para o cliente selecionado.",
      updateSchedule: "Nao foi possivel atualizar o agendamento.",
      invalidDeliveryDate: "Data de entrega invalida.",
      invalidWindowStart: "Inicio da janela invalido.",
      invalidWindowEnd: "Fim da janela invalido.",
      updateStatus: "Nao foi possivel atualizar o status.",
      updateTransport: "Nao foi possivel alterar o transporte."
    },
    dashboard: {
      title: "Monitoramento Operacional",
      description: "Visibilidade do ciclo logistico das Ordens de Venda."
    },
    orders: {
      title: "Ordens de Venda",
      description: "Consulta, filtros operacionais e acesso aos detalhes.",
      new: "Nova Ordem",
      createTitle: "Criar Ordem de Venda",
      createDescription: "Associacao de cliente, transporte autorizado e itens cadastrados.",
      loading: "Carregando ordens...",
      emptyTitle: "Nenhuma Ordem de Venda encontrada",
      emptyDescription: "Ajuste os filtros ou crie uma nova Ordem de Venda.",
      code: "Codigo",
      customer: "Cliente",
      transport: "Transporte",
      delivery: "Entrega",
      currentTransport: "Transporte atual",
      deliveryDate: "Data de entrega",
      window: "Janela",
      detailsDescription: "Detalhe, status, agendamento, transporte e auditoria.",
      loadingOne: "Carregando ordem...",
      notFound: "Ordem nao encontrada.",
      salesOrder: "Ordem de Venda",
      advanceTo: "Avancar para {status}",
      transitionDescription: "A transicao sera validada pela API antes de persistir a alteracao.",
      advanceStatus: "Avancar status",
      authorizedType: "Tipo autorizado",
      change: "Alterar"
    },
    orderForm: {
      title: "Nova Ordem de Venda",
      description: "Cliente, transporte autorizado e itens cadastrados.",
      customer: "Cliente",
      transportType: "Tipo de transporte",
      item: "Item",
      quantity: "Quantidade",
      shortQuantity: "Qtd.",
      add: "Adicionar",
      removeItem: "Remover item",
      creating: "Criando...",
      create: "Criar Ordem de Venda"
    },
    filters: {
      status: "Status",
      customer: "Cliente",
      transport: "Transporte",
      dateFrom: "Data inicial",
      dateTo: "Data final"
    },
    customers: {
      title: "Clientes",
      description: "Cadastro, consulta e edicao de clientes.",
      new: "Novo cliente",
      edit: "Editar cliente",
      name: "Nome",
      document: "Documento",
      email: "E-mail",
      authorizedTransports: "Transportes autorizados",
      registered: "Clientes cadastrados",
      transports: "Transportes"
    },
    items: {
      title: "Itens",
      description: "Cadastro e consulta de itens por SKU.",
      new: "Novo item",
      registered: "Itens cadastrados",
      sku: "SKU",
      name: "Nome",
      descriptionField: "Descricao",
      item: "Item"
    },
    transportTypes: {
      title: "Tipos de Transporte",
      description: "Cadastro, consulta e edicao das modalidades de transporte.",
      new: "Novo transporte",
      edit: "Editar transporte",
      registered: "Transportes cadastrados",
      name: "Nome",
      situation: "Situacao"
    },
    scheduling: {
      title: "Central de Agendamento",
      description: "Definicao de data, janela de atendimento, confirmacao e reagendamento.",
      loading: "Carregando agendamentos...",
      empty: "Nenhuma Ordem de Venda planejada para agendamento.",
      formTitle: "Agendamento",
      deliveryDate: "Data de entrega",
      windowStart: "Inicio da janela",
      windowEnd: "Fim da janela",
      confirm: "Confirmar agendamento",
      save: "Salvar agendamento"
    },
    audit: {
      title: "Auditoria",
      loading: "Carregando auditoria...",
      emptyTitle: "Sem eventos",
      emptyDescription: "Esta entidade ainda nao possui eventos de auditoria.",
      previous: "anterior",
      next: "posterior"
    }
  },
  en: {
    metadata: {
      title: "OVGS",
      description: "Sales Order Management System"
    },
    language: {
      label: "Language"
    },
    common: {
      all: "All",
      open: "Open",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      edit: "Edit",
      active: "Active",
      inactive: "Inactive",
      clear: "Clear",
      select: "Select",
      processing: "Processing...",
      notAvailable: "-"
    },
    nav: {
      operation: "Operation",
      orders: "Orders",
      scheduling: "Scheduling",
      customers: "Customers",
      transportTypes: "Transports",
      items: "Items"
    },
    status: {
      CRIADA: "Created",
      PLANEJADA: "Planned",
      AGENDADA: "Scheduled",
      EM_TRANSPORTE: "In transit",
      ENTREGUE: "Delivered"
    } satisfies Record<SalesOrderStatus, string>,
    auditActions: {
      STATUS_CHANGED: "Status changed",
      SALES_ORDER_CREATED: "Sales order created",
      TRANSPORT_CHANGED: "Transport changed",
      SCHEDULE_UPDATED: "Schedule updated",
      SHARE_LINK_CREATED: "Share link created"
    },
    validation: {
      minTwoCharacters: "Enter at least 2 characters",
      invalidDocument: "Enter a valid document",
      invalidEmail: "Enter a valid email",
      invalidQuantity: "Enter a valid quantity",
      selectCustomer: "Select a customer",
      selectTransportType: "Select a transport type",
      selectItem: "Select an item",
      deliveryDateRequired: "Enter the delivery date",
      invalidTime: "Invalid time",
      deliveryWindowEndAfterStart: "The end of the window must be later than the start"
    },
    errors: {
      genericOperation: "The operation could not be completed",
      saveCustomer: "The customer could not be saved.",
      duplicateDocument: "Document already registered.",
      createItem: "The item could not be created.",
      duplicateSku: "SKU already registered.",
      saveTransportType: "The transport type could not be saved.",
      duplicateTransportName: "Name already registered.",
      createOrder: "The order could not be created.",
      invalidCustomer: "Invalid customer.",
      invalidTransportType: "Invalid transport type.",
      noOrderItems: "Add at least one item to the Sales Order.",
      unauthorizedTransport: "Transport type is not authorized for the selected customer.",
      updateSchedule: "The schedule could not be updated.",
      invalidDeliveryDate: "Invalid delivery date.",
      invalidWindowStart: "Invalid window start.",
      invalidWindowEnd: "Invalid window end.",
      updateStatus: "The status could not be updated.",
      updateTransport: "The transport could not be changed."
    },
    dashboard: {
      title: "Operational Monitoring",
      description: "Visibility into the logistics cycle of Sales Orders."
    },
    orders: {
      title: "Sales Orders",
      description: "Search, operational filters and detail access.",
      new: "New Order",
      createTitle: "Create Sales Order",
      createDescription: "Customer, authorized transport and registered items.",
      loading: "Loading orders...",
      emptyTitle: "No Sales Orders found",
      emptyDescription: "Adjust the filters or create a new Sales Order.",
      code: "Code",
      customer: "Customer",
      transport: "Transport",
      delivery: "Delivery",
      currentTransport: "Current transport",
      deliveryDate: "Delivery date",
      window: "Window",
      detailsDescription: "Details, status, schedule, transport and audit.",
      loadingOne: "Loading order...",
      notFound: "Order not found.",
      salesOrder: "Sales Order",
      advanceTo: "Advance to {status}",
      transitionDescription: "The transition will be validated by the API before persisting the change.",
      advanceStatus: "Advance status",
      authorizedType: "Authorized type",
      change: "Change"
    },
    orderForm: {
      title: "New Sales Order",
      description: "Customer, authorized transport and registered items.",
      customer: "Customer",
      transportType: "Transport type",
      item: "Item",
      quantity: "Quantity",
      shortQuantity: "Qty.",
      add: "Add",
      removeItem: "Remove item",
      creating: "Creating...",
      create: "Create Sales Order"
    },
    filters: {
      status: "Status",
      customer: "Customer",
      transport: "Transport",
      dateFrom: "Start date",
      dateTo: "End date"
    },
    customers: {
      title: "Customers",
      description: "Create, search and edit customers.",
      new: "New customer",
      edit: "Edit customer",
      name: "Name",
      document: "Document",
      email: "Email",
      authorizedTransports: "Authorized transports",
      registered: "Registered customers",
      transports: "Transports"
    },
    items: {
      title: "Items",
      description: "Create and search items by SKU.",
      new: "New item",
      registered: "Registered items",
      sku: "SKU",
      name: "Name",
      descriptionField: "Description",
      item: "Item"
    },
    transportTypes: {
      title: "Transport Types",
      description: "Create, search and edit transport modes.",
      new: "New transport",
      edit: "Edit transport",
      registered: "Registered transports",
      name: "Name",
      situation: "Status"
    },
    scheduling: {
      title: "Scheduling Center",
      description: "Delivery date, service window, confirmation and rescheduling.",
      loading: "Loading schedules...",
      empty: "No planned Sales Orders available for scheduling.",
      formTitle: "Scheduling",
      deliveryDate: "Delivery date",
      windowStart: "Window start",
      windowEnd: "Window end",
      confirm: "Confirm schedule",
      save: "Save schedule"
    },
    audit: {
      title: "Audit",
      loading: "Loading audit...",
      emptyTitle: "No events",
      emptyDescription: "This entity does not have audit events yet.",
      previous: "previous",
      next: "next"
    }
  },
  es: {
    metadata: {
      title: "OVGS",
      description: "Sistema de Gestion de Ordenes de Venta"
    },
    language: {
      label: "Idioma"
    },
    common: {
      all: "Todos",
      open: "Abrir",
      save: "Guardar",
      saving: "Guardando...",
      cancel: "Cancelar",
      edit: "Editar",
      active: "Activo",
      inactive: "Inactivo",
      clear: "Limpiar",
      select: "Seleccione",
      processing: "Procesando...",
      notAvailable: "-"
    },
    nav: {
      operation: "Operacion",
      orders: "Ordenes",
      scheduling: "Agenda",
      customers: "Clientes",
      transportTypes: "Transportes",
      items: "Items"
    },
    status: {
      CRIADA: "Creada",
      PLANEJADA: "Planificada",
      AGENDADA: "Agendada",
      EM_TRANSPORTE: "En transporte",
      ENTREGUE: "Entregada"
    } satisfies Record<SalesOrderStatus, string>,
    auditActions: {
      STATUS_CHANGED: "Estado cambiado",
      SALES_ORDER_CREATED: "Orden de venta creada",
      TRANSPORT_CHANGED: "Transporte cambiado",
      SCHEDULE_UPDATED: "Agenda actualizada",
      SHARE_LINK_CREATED: "Enlace compartido creado"
    },
    validation: {
      minTwoCharacters: "Ingrese al menos 2 caracteres",
      invalidDocument: "Ingrese un documento valido",
      invalidEmail: "Ingrese un e-mail valido",
      invalidQuantity: "Ingrese una cantidad valida",
      selectCustomer: "Seleccione un cliente",
      selectTransportType: "Seleccione un tipo de transporte",
      selectItem: "Seleccione un item",
      deliveryDateRequired: "Ingrese la fecha de entrega",
      invalidTime: "Horario invalido",
      deliveryWindowEndAfterStart: "El fin de la ventana debe ser mayor que el inicio"
    },
    errors: {
      genericOperation: "No fue posible completar la operacion",
      saveCustomer: "No fue posible guardar el cliente.",
      duplicateDocument: "Documento ya registrado.",
      createItem: "No fue posible crear el item.",
      duplicateSku: "SKU ya registrado.",
      saveTransportType: "No fue posible guardar el tipo de transporte.",
      duplicateTransportName: "Nombre ya registrado.",
      createOrder: "No fue posible crear la orden.",
      invalidCustomer: "Cliente invalido.",
      invalidTransportType: "Tipo de transporte invalido.",
      noOrderItems: "Agregue al menos un item a la Orden de Venta.",
      unauthorizedTransport: "El tipo de transporte no esta autorizado para el cliente seleccionado.",
      updateSchedule: "No fue posible actualizar la agenda.",
      invalidDeliveryDate: "Fecha de entrega invalida.",
      invalidWindowStart: "Inicio de ventana invalido.",
      invalidWindowEnd: "Fin de ventana invalido.",
      updateStatus: "No fue posible actualizar el estado.",
      updateTransport: "No fue posible cambiar el transporte."
    },
    dashboard: {
      title: "Monitoreo Operacional",
      description: "Visibilidad del ciclo logistico de las Ordenes de Venta."
    },
    orders: {
      title: "Ordenes de Venta",
      description: "Consulta, filtros operacionales y acceso a detalles.",
      new: "Nueva Orden",
      createTitle: "Crear Orden de Venta",
      createDescription: "Asociacion de cliente, transporte autorizado e items registrados.",
      loading: "Cargando ordenes...",
      emptyTitle: "No se encontraron Ordenes de Venta",
      emptyDescription: "Ajuste los filtros o cree una nueva Orden de Venta.",
      code: "Codigo",
      customer: "Cliente",
      transport: "Transporte",
      delivery: "Entrega",
      currentTransport: "Transporte actual",
      deliveryDate: "Fecha de entrega",
      window: "Ventana",
      detailsDescription: "Detalle, estado, agenda, transporte y auditoria.",
      loadingOne: "Cargando orden...",
      notFound: "Orden no encontrada.",
      salesOrder: "Orden de Venta",
      advanceTo: "Avanzar a {status}",
      transitionDescription: "La transicion sera validada por la API antes de persistir el cambio.",
      advanceStatus: "Avanzar estado",
      authorizedType: "Tipo autorizado",
      change: "Cambiar"
    },
    orderForm: {
      title: "Nueva Orden de Venta",
      description: "Cliente, transporte autorizado e items registrados.",
      customer: "Cliente",
      transportType: "Tipo de transporte",
      item: "Item",
      quantity: "Cantidad",
      shortQuantity: "Cant.",
      add: "Agregar",
      removeItem: "Remover item",
      creating: "Creando...",
      create: "Crear Orden de Venta"
    },
    filters: {
      status: "Estado",
      customer: "Cliente",
      transport: "Transporte",
      dateFrom: "Fecha inicial",
      dateTo: "Fecha final"
    },
    customers: {
      title: "Clientes",
      description: "Registro, consulta y edicion de clientes.",
      new: "Nuevo cliente",
      edit: "Editar cliente",
      name: "Nombre",
      document: "Documento",
      email: "E-mail",
      authorizedTransports: "Transportes autorizados",
      registered: "Clientes registrados",
      transports: "Transportes"
    },
    items: {
      title: "Items",
      description: "Registro y consulta de items por SKU.",
      new: "Nuevo item",
      registered: "Items registrados",
      sku: "SKU",
      name: "Nombre",
      descriptionField: "Descripcion",
      item: "Item"
    },
    transportTypes: {
      title: "Tipos de Transporte",
      description: "Registro, consulta y edicion de modalidades de transporte.",
      new: "Nuevo transporte",
      edit: "Editar transporte",
      registered: "Transportes registrados",
      name: "Nombre",
      situation: "Situacion"
    },
    scheduling: {
      title: "Central de Agenda",
      description: "Definicion de fecha, ventana de atencion, confirmacion y reagendamiento.",
      loading: "Cargando agendas...",
      empty: "Ninguna Orden de Venta planificada para agendar.",
      formTitle: "Agenda",
      deliveryDate: "Fecha de entrega",
      windowStart: "Inicio de ventana",
      windowEnd: "Fin de ventana",
      confirm: "Confirmar agenda",
      save: "Guardar agenda"
    },
    audit: {
      title: "Auditoria",
      loading: "Cargando auditoria...",
      emptyTitle: "Sin eventos",
      emptyDescription: "Esta entidad aun no posee eventos de auditoria.",
      previous: "anterior",
      next: "posterior"
    }
  }
} as const;
