import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccessAction, AccessModule } from "../../common/access-control/access-control.types";
import { RequirePermission } from "../../common/access-control/require-permission.decorator";
import { CreateShareLinkDto } from "./dto/create-share-link.dto";
import { SharingService } from "./sharing.service";

@ApiTags("sharing")
@Controller()
export class SharingController {
  constructor(private readonly sharingService: SharingService) {}

  @Post("sales-orders/:id/share")
  @RequirePermission(AccessModule.SalesOrders, AccessAction.Share)
  createSalesOrderShareLink(
    @Param("id") id: string,
    @Headers("x-user-id") userId: string | undefined,
    @Body() dto: CreateShareLinkDto
  ) {
    return this.sharingService.createSalesOrderShareLink(id, userId ?? "anonymous", dto);
  }

  @Get("shared/sales-orders/:token")
  getSharedSalesOrder(@Param("token") token: string) {
    return this.sharingService.getSharedSalesOrder(token);
  }
}
