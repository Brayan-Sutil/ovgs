import { Body, Controller, Get, Param, Patch, Query, Req } from "@nestjs/common";
import { SalesOrderStatus } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import {
  AccessAction,
  AccessModule,
  AuthenticatedUser
} from "../../common/access-control/access-control.types";
import { RequirePermission } from "../../common/access-control/require-permission.decorator";
import { ListSalesOrdersQueryDto } from "../sales-orders/dto/list-sales-orders-query.dto";
import { SalesOrdersService } from "../sales-orders/sales-orders.service";
import { UpdateSalesOrderScheduleDto } from "./dto/update-sales-order-schedule.dto";

type RequestWithUser = {
  user?: AuthenticatedUser;
};

@ApiTags("scheduling")
@Controller("scheduling")
export class SchedulingController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Get()
  @RequirePermission(AccessModule.Scheduling, AccessAction.Read)
  findSchedulable(@Query() query: ListSalesOrdersQueryDto, @Req() request: RequestWithUser) {
    return this.salesOrdersService.findAll({
      ...query,
      status: query.status ?? SalesOrderStatus.PLANEJADA
    }, request.user);
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
