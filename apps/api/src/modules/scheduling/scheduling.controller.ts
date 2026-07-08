import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { SalesOrderStatus } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { AccessAction, AccessModule } from "../../common/access-control/access-control.types";
import { RequirePermission } from "../../common/access-control/require-permission.decorator";
import { ListSalesOrdersQueryDto } from "../sales-orders/dto/list-sales-orders-query.dto";
import { SalesOrdersService } from "../sales-orders/sales-orders.service";
import { UpdateSalesOrderScheduleDto } from "./dto/update-sales-order-schedule.dto";

@ApiTags("scheduling")
@Controller("scheduling")
export class SchedulingController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Get()
  @RequirePermission(AccessModule.Scheduling, AccessAction.Read)
  findSchedulable(@Query() query: ListSalesOrdersQueryDto) {
    return this.salesOrdersService.findAll({
      ...query,
      status: query.status ?? SalesOrderStatus.PLANEJADA
    });
  }

  @Patch(":salesOrderId")
  @RequirePermission(AccessModule.Scheduling, AccessAction.Update)
  updateSchedule(
    @Param("salesOrderId") salesOrderId: string,
    @Body() dto: UpdateSalesOrderScheduleDto
  ) {
    return this.salesOrdersService.updateSchedule(salesOrderId, dto);
  }
}
