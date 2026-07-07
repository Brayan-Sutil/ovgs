import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UpdateSalesOrderScheduleDto } from "../scheduling/dto/update-sales-order-schedule.dto";
import { CreateSalesOrderDto } from "./dto/create-sales-order.dto";
import { ListSalesOrdersQueryDto } from "./dto/list-sales-orders-query.dto";
import { UpdateSalesOrderStatusDto } from "./dto/update-sales-order-status.dto";
import { UpdateSalesOrderTransportDto } from "./dto/update-sales-order-transport.dto";
import { SalesOrdersService } from "./sales-orders.service";

@ApiTags("sales-orders")
@Controller("sales-orders")
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Post()
  create(@Body() dto: CreateSalesOrderDto) {
    return this.salesOrdersService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListSalesOrdersQueryDto) {
    return this.salesOrdersService.findAll(query);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.salesOrdersService.findById(id);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateSalesOrderStatusDto) {
    return this.salesOrdersService.updateStatus(id, dto);
  }

  @Patch(":id/schedule")
  updateSchedule(@Param("id") id: string, @Body() dto: UpdateSalesOrderScheduleDto) {
    return this.salesOrdersService.updateSchedule(id, dto);
  }

  @Patch(":id/transport")
  updateTransport(@Param("id") id: string, @Body() dto: UpdateSalesOrderTransportDto) {
    return this.salesOrdersService.updateTransport(id, dto);
  }
}
