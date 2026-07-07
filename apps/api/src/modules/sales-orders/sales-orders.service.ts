import { randomUUID } from "node:crypto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SalesOrderStatus } from "@prisma/client";
import { AuditService } from "../audit/audit.service";
import { AuditActions } from "../audit/audit.types";
import { UpdateSalesOrderScheduleDto } from "../scheduling/dto/update-sales-order-schedule.dto";
import { CreateSalesOrderDto } from "./dto/create-sales-order.dto";
import { ListSalesOrdersQueryDto } from "./dto/list-sales-orders-query.dto";
import { UpdateSalesOrderStatusDto } from "./dto/update-sales-order-status.dto";
import { UpdateSalesOrderTransportDto } from "./dto/update-sales-order-transport.dto";
import {
  canTransitionSalesOrderStatus,
  getNextSalesOrderStatus
} from "./sales-order-status-flow";
import { SalesOrdersRepository } from "./sales-orders.repository";

@Injectable()
export class SalesOrdersService {
  constructor(
    private readonly salesOrdersRepository: SalesOrdersRepository,
    private readonly auditService: AuditService
  ) {}

  async create(dto: CreateSalesOrderDto) {
    await this.validateCustomerTransport(dto.customerId, dto.transportTypeId);
    await this.validateItems(dto.items.map((item) => item.itemId));

    const order = await this.salesOrdersRepository.create(generateSalesOrderCode(), dto);

    await this.auditService.record({
      entityType: "SalesOrder",
      entityId: order.id,
      action: AuditActions.SalesOrderCreated,
      previousState: null,
      nextState: snapshotSalesOrder(order)
    });

    return order;
  }

  findAll(query: ListSalesOrdersQueryDto) {
    return this.salesOrdersRepository.findAll(query);
  }

  async findById(id: string) {
    const order = await this.salesOrdersRepository.findById(id);

    if (!order) {
      throw new NotFoundException("Ordem de Venda nao encontrada");
    }

    return {
      ...order,
      nextStatus: getNextSalesOrderStatus(order.status)
    };
  }

  async updateStatus(id: string, dto: UpdateSalesOrderStatusDto) {
    const order = await this.findExistingOrder(id);

    if (!canTransitionSalesOrderStatus(order.status, dto.status)) {
      throw new BadRequestException(
        `Transicao invalida de ${order.status} para ${dto.status}`
      );
    }

    const updatedOrder = await this.salesOrdersRepository.updateStatus(id, dto.status);

    await this.auditService.record({
      entityType: "SalesOrder",
      entityId: id,
      action: AuditActions.StatusChanged,
      previousState: { status: order.status },
      nextState: { status: updatedOrder.status }
    });

    return updatedOrder;
  }

  async updateSchedule(id: string, dto: UpdateSalesOrderScheduleDto) {
    const order = await this.findExistingOrder(id);
    const shouldConfirm = dto.confirmed === true;
    const statusPatch = getScheduleStatusPatch(order.status, shouldConfirm);

    const updatedOrder = await this.salesOrdersRepository.updateSchedule(id, {
      deliveryDate: new Date(dto.deliveryDate),
      deliveryWindowStart: dto.deliveryWindowStart,
      deliveryWindowEnd: dto.deliveryWindowEnd,
      scheduleConfirmedAt: shouldConfirm ? new Date() : null,
      status: statusPatch
    });

    await this.auditService.record({
      entityType: "SalesOrder",
      entityId: id,
      action: AuditActions.ScheduleChanged,
      previousState: snapshotSchedule(order),
      nextState: snapshotSchedule(updatedOrder)
    });

    if (statusPatch && statusPatch !== order.status) {
      await this.auditService.record({
        entityType: "SalesOrder",
        entityId: id,
        action: AuditActions.StatusChanged,
        previousState: { status: order.status },
        nextState: { status: updatedOrder.status }
      });
    }

    return updatedOrder;
  }

  async updateTransport(id: string, dto: UpdateSalesOrderTransportDto) {
    const order = await this.findExistingOrder(id);

    await this.validateCustomerTransport(order.customerId, dto.transportTypeId);

    const updatedOrder = await this.salesOrdersRepository.updateTransport(
      id,
      dto.transportTypeId
    );

    await this.auditService.record({
      entityType: "SalesOrder",
      entityId: id,
      action: AuditActions.TransportChanged,
      previousState: { transportTypeId: order.transportTypeId },
      nextState: { transportTypeId: updatedOrder.transportTypeId }
    });

    return updatedOrder;
  }

  private async findExistingOrder(id: string) {
    const order = await this.salesOrdersRepository.findById(id);

    if (!order) {
      throw new NotFoundException("Ordem de Venda nao encontrada");
    }

    return order;
  }

  private async validateCustomerTransport(customerId: string, transportTypeId: string) {
    const [customer, transportType] = await Promise.all([
      this.salesOrdersRepository.findCustomerWithAuthorizedTransports(customerId),
      this.salesOrdersRepository.findTransportType(transportTypeId)
    ]);

    if (!customer) {
      throw new NotFoundException("Cliente nao encontrado");
    }

    if (!transportType || !transportType.active) {
      throw new NotFoundException("Tipo de transporte nao encontrado ou inativo");
    }

    const isAuthorized = customer.authorizedTransportTypes.some(
      (authorization) => authorization.transportTypeId === transportTypeId
    );

    if (!isAuthorized) {
      throw new BadRequestException(
        "Tipo de transporte nao autorizado para o cliente selecionado"
      );
    }
  }

  private async validateItems(itemIds: string[]) {
    if (itemIds.length === 0) {
      throw new BadRequestException("A Ordem de Venda deve conter ao menos um item");
    }

    const items = await this.salesOrdersRepository.findItemsByIds(itemIds);

    if (items.length !== itemIds.length) {
      throw new BadRequestException("Todos os itens devem existir e estar ativos");
    }
  }
}

function getScheduleStatusPatch(status: SalesOrderStatus, shouldConfirm: boolean) {
  if (!shouldConfirm) {
    return undefined;
  }

  if (status === SalesOrderStatus.PLANEJADA) {
    return SalesOrderStatus.AGENDADA;
  }

  if (status === SalesOrderStatus.AGENDADA) {
    return status;
  }

  throw new BadRequestException(
    "Somente Ordens de Venda planejadas podem ter agendamento confirmado"
  );
}

function generateSalesOrderCode() {
  const suffix = randomUUID().slice(0, 8).toUpperCase();
  return `OV-${suffix}`;
}

function snapshotSalesOrder(order: {
  id: string;
  code: string;
  customerId: string;
  transportTypeId: string;
  status: SalesOrderStatus;
}) {
  return {
    id: order.id,
    code: order.code,
    customerId: order.customerId,
    transportTypeId: order.transportTypeId,
    status: order.status
  };
}

function snapshotSchedule(order: {
  deliveryDate: Date | null;
  deliveryWindowStart: string | null;
  deliveryWindowEnd: string | null;
  scheduleConfirmedAt: Date | null;
}) {
  return {
    deliveryDate: order.deliveryDate?.toISOString() ?? null,
    deliveryWindowStart: order.deliveryWindowStart,
    deliveryWindowEnd: order.deliveryWindowEnd,
    scheduleConfirmedAt: order.scheduleConfirmedAt?.toISOString() ?? null
  };
}
