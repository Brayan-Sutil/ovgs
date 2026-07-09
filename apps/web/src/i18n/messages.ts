import { SalesOrderStatus } from "@/features/sales-orders/types";

export const locales = ["pt", "en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español"
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
      description: "Sistema de Gestão de Ordens de Venda"
    },
    language: {
      label: "Idioma"
    },
    auth: {
      loginTitle: "Entrar no OVGS",
      loginDescription: "Escolha uma visão para acessar a demonstração.",
      chooseProfile: "Perfis disponíveis",
      companyAccess: "Entrar como empresa",
      companyDescription: "Acesso administrativo completo para operação, cadastros e gestão das ordens.",
      customerAccess: "Entrar como cliente",
      customerDescription: "Portal simples para consultar ordens, status, itens e previsão de entrega.",
      loadingCustomers: "Carregando clientes...",
      selectCustomer: "Escolha o cliente",
      continueAsCustomer: "Continuar como cliente",
      noCustomers: "Ainda não há clientes cadastrados. Entre como empresa para cadastrar o primeiro cliente.",
      customerUnavailable: "Não foi possível carregar os clientes agora. Entre como empresa para revisar o cadastro.",
      signedInAs: "Perfil",
      customerReadOnly: "Visão do cliente",
      customerReadOnlyDescription: "Este perfil acompanha as ordens da Acme Distribuidora sem alterar dados operacionais.",
      logout: "Sair"
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
      operation: "Operação",
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
      invalidDocument: "Informe um documento válido",
      invalidEmail: "Informe um e-mail válido",
      invalidQuantity: "Informe uma quantidade válida",
      selectCustomer: "Selecione um cliente",
      selectTransportType: "Selecione um tipo de transporte",
      selectItem: "Selecione um item",
      deliveryDateRequired: "Informe a data de entrega",
      invalidTime: "Horário inválido",
      deliveryWindowEndAfterStart: "A janela final deve ser maior que a inicial"
    },
    errors: {
      genericOperation: "Não foi possível concluir a operação",
      saveCustomer: "Não foi possível salvar o cliente.",
      duplicateDocument: "Documento já cadastrado.",
      createItem: "Não foi possível criar o item.",
      duplicateSku: "SKU já cadastrado.",
      saveTransportType: "Não foi possível salvar o tipo de transporte.",
      duplicateTransportName: "Nome já cadastrado.",
      createOrder: "Não foi possível criar a ordem.",
      invalidCustomer: "Cliente inválido.",
      invalidTransportType: "Tipo de transporte inválido.",
      noOrderItems: "Adicione ao menos um item à Ordem de Venda.",
      unauthorizedTransport: "Tipo de transporte não autorizado para o cliente selecionado.",
      updateSchedule: "Não foi possível atualizar o agendamento.",
      invalidDeliveryDate: "Data de entrega inválida.",
      invalidWindowStart: "Início da janela inválido.",
      invalidWindowEnd: "Fim da janela inválido.",
      updateStatus: "Não foi possível atualizar o status.",
      updateTransport: "Não foi possível alterar o transporte."
    },
    dashboard: {
      title: "Monitoramento Operacional",
      description: "Visibilidade do ciclo logístico das Ordens de Venda."
    },
    orders: {
      title: "Ordens de Venda",
      description: "Consulta, filtros operacionais e acesso aos detalhes.",
      new: "Nova Ordem",
      createTitle: "Criar Ordem de Venda",
      createDescription: "Associação de cliente, transporte autorizado e itens cadastrados.",
      loading: "Carregando ordens...",
      emptyTitle: "Nenhuma Ordem de Venda encontrada",
      emptyDescription: "Ajuste os filtros ou crie uma nova Ordem de Venda.",
      code: "Código",
      customer: "Cliente",
      transport: "Transporte",
      delivery: "Entrega",
      currentTransport: "Transporte atual",
      deliveryDate: "Data de entrega",
      window: "Janela",
      detailsDescription: "Detalhe, status, agendamento, transporte e auditoria.",
      loadingOne: "Carregando ordem...",
      notFound: "Ordem não encontrada.",
      salesOrder: "Ordem de Venda",
      advanceTo: "Avançar para {status}",
      transitionDescription: "A transição será validada pela API antes de persistir a alteração.",
      advanceStatus: "Avançar status",
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
      description: "Cadastro, consulta e edição de clientes.",
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
      descriptionField: "Descrição",
      item: "Item"
    },
    transportTypes: {
      title: "Tipos de Transporte",
      description: "Cadastro, consulta e edição das modalidades de transporte.",
      new: "Novo transporte",
      edit: "Editar transporte",
      registered: "Transportes cadastrados",
      name: "Nome",
      situation: "Situação"
    },
    scheduling: {
      title: "Central de Agendamento",
      description: "Definição de data, janela de atendimento, confirmação e reagendamento.",
      loading: "Carregando agendamentos...",
      empty: "Nenhuma Ordem de Venda planejada para agendamento.",
      formTitle: "Agendamento",
      deliveryDate: "Data de entrega",
      windowStart: "Início da janela",
      windowEnd: "Fim da janela",
      confirm: "Confirmar agendamento",
      save: "Salvar agendamento"
    },
    audit: {
      title: "Auditoria",
      loading: "Carregando auditoria...",
      emptyTitle: "Sem eventos",
      emptyDescription: "Esta entidade ainda não possui eventos de auditoria.",
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
    auth: {
      loginTitle: "Sign in to OVGS",
      loginDescription: "Choose a view to access the demo.",
      chooseProfile: "Available profiles",
      companyAccess: "Sign in as company",
      companyDescription: "Full administrative access for operations, records and order management.",
      customerAccess: "Sign in as customer",
      customerDescription: "Simple portal to view orders, status, items and delivery forecast.",
      loadingCustomers: "Loading customers...",
      selectCustomer: "Choose the customer",
      continueAsCustomer: "Continue as customer",
      noCustomers: "There are no customers yet. Sign in as company to create the first customer.",
      customerUnavailable: "Customers could not be loaded now. Sign in as company to review customer records.",
      signedInAs: "Profile",
      customerReadOnly: "Customer view",
      customerReadOnlyDescription: "This profile follows Acme Distribuidora orders without changing operational data.",
      logout: "Sign out"
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
      description: "Sistema de Gestión de Órdenes de Venta"
    },
    language: {
      label: "Idioma"
    },
    auth: {
      loginTitle: "Entrar en OVGS",
      loginDescription: "Elija una vista para acceder a la demostración.",
      chooseProfile: "Perfiles disponibles",
      companyAccess: "Entrar como empresa",
      companyDescription: "Acceso administrativo completo para operación, registros y gestión de órdenes.",
      customerAccess: "Entrar como cliente",
      customerDescription: "Portal simple para consultar órdenes, estado, ítems y previsión de entrega.",
      loadingCustomers: "Cargando clientes...",
      selectCustomer: "Elija el cliente",
      continueAsCustomer: "Continuar como cliente",
      noCustomers: "Aún no hay clientes registrados. Entre como empresa para registrar el primer cliente.",
      customerUnavailable: "No fue posible cargar los clientes ahora. Entre como empresa para revisar el registro.",
      signedInAs: "Perfil",
      customerReadOnly: "Vista del cliente",
      customerReadOnlyDescription: "Este perfil acompaña las órdenes de Acme Distribuidora sin alterar datos operacionales.",
      logout: "Salir"
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
      operation: "Operación",
      orders: "Órdenes",
      scheduling: "Agenda",
      customers: "Clientes",
      transportTypes: "Transportes",
      items: "Ítems"
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
      invalidDocument: "Ingrese un documento válido",
      invalidEmail: "Ingrese un e-mail válido",
      invalidQuantity: "Ingrese una cantidad válida",
      selectCustomer: "Seleccione un cliente",
      selectTransportType: "Seleccione un tipo de transporte",
      selectItem: "Seleccione un ítem",
      deliveryDateRequired: "Ingrese la fecha de entrega",
      invalidTime: "Horario inválido",
      deliveryWindowEndAfterStart: "El fin de la ventana debe ser mayor que el inicio"
    },
    errors: {
      genericOperation: "No fue posible completar la operación",
      saveCustomer: "No fue posible guardar el cliente.",
      duplicateDocument: "Documento ya registrado.",
      createItem: "No fue posible crear el ítem.",
      duplicateSku: "SKU ya registrado.",
      saveTransportType: "No fue posible guardar el tipo de transporte.",
      duplicateTransportName: "Nombre ya registrado.",
      createOrder: "No fue posible crear la orden.",
      invalidCustomer: "Cliente inválido.",
      invalidTransportType: "Tipo de transporte inválido.",
      noOrderItems: "Agregue al menos un ítem a la Orden de Venta.",
      unauthorizedTransport: "El tipo de transporte no está autorizado para el cliente seleccionado.",
      updateSchedule: "No fue posible actualizar la agenda.",
      invalidDeliveryDate: "Fecha de entrega inválida.",
      invalidWindowStart: "Inicio de ventana inválido.",
      invalidWindowEnd: "Fin de ventana inválido.",
      updateStatus: "No fue posible actualizar el estado.",
      updateTransport: "No fue posible cambiar el transporte."
    },
    dashboard: {
      title: "Monitoreo Operacional",
      description: "Visibilidad del ciclo logístico de las Órdenes de Venta."
    },
    orders: {
      title: "Órdenes de Venta",
      description: "Consulta, filtros operacionales y acceso a detalles.",
      new: "Nueva Orden",
      createTitle: "Crear Orden de Venta",
      createDescription: "Asociación de cliente, transporte autorizado e ítems registrados.",
      loading: "Cargando órdenes...",
      emptyTitle: "No se encontraron Órdenes de Venta",
      emptyDescription: "Ajuste los filtros o cree una nueva Orden de Venta.",
      code: "Código",
      customer: "Cliente",
      transport: "Transporte",
      delivery: "Entrega",
      currentTransport: "Transporte actual",
      deliveryDate: "Fecha de entrega",
      window: "Ventana",
      detailsDescription: "Detalle, estado, agenda, transporte y auditoría.",
      loadingOne: "Cargando orden...",
      notFound: "Orden no encontrada.",
      salesOrder: "Orden de Venta",
      advanceTo: "Avanzar a {status}",
      transitionDescription: "La transición será validada por la API antes de persistir el cambio.",
      advanceStatus: "Avanzar estado",
      authorizedType: "Tipo autorizado",
      change: "Cambiar"
    },
    orderForm: {
      title: "Nueva Orden de Venta",
      description: "Cliente, transporte autorizado e ítems registrados.",
      customer: "Cliente",
      transportType: "Tipo de transporte",
      item: "Ítem",
      quantity: "Cantidad",
      shortQuantity: "Cant.",
      add: "Agregar",
      removeItem: "Remover ítem",
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
      description: "Registro, consulta y edición de clientes.",
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
      title: "Ítems",
      description: "Registro y consulta de ítems por SKU.",
      new: "Nuevo ítem",
      registered: "Ítems registrados",
      sku: "SKU",
      name: "Nombre",
      descriptionField: "Descripción",
      item: "Ítem"
    },
    transportTypes: {
      title: "Tipos de Transporte",
      description: "Registro, consulta y edición de modalidades de transporte.",
      new: "Nuevo transporte",
      edit: "Editar transporte",
      registered: "Transportes registrados",
      name: "Nombre",
      situation: "Situación"
    },
    scheduling: {
      title: "Central de Agenda",
      description: "Definición de fecha, ventana de atención, confirmación y reagendamiento.",
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
      title: "Auditoría",
      loading: "Cargando auditoría...",
      emptyTitle: "Sin eventos",
      emptyDescription: "Esta entidad aún no posee eventos de auditoría.",
      previous: "anterior",
      next: "posterior"
    }
  }
} as const;
