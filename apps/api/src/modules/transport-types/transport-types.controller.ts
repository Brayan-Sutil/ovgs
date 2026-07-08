import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccessAction, AccessModule } from "../../common/access-control/access-control.types";
import { RequirePermission } from "../../common/access-control/require-permission.decorator";
import { CreateTransportTypeDto } from "./dto/create-transport-type.dto";
import { UpdateTransportTypeDto } from "./dto/update-transport-type.dto";
import { TransportTypesService } from "./transport-types.service";

@ApiTags("transport-types")
@Controller("transport-types")
export class TransportTypesController {
  constructor(private readonly transportTypesService: TransportTypesService) {}

  @Post()
  @RequirePermission(AccessModule.TransportTypes, AccessAction.Create)
  create(@Body() dto: CreateTransportTypeDto) {
    return this.transportTypesService.create(dto);
  }

  @Get()
  @RequirePermission(AccessModule.TransportTypes, AccessAction.Read)
  findAll() {
    return this.transportTypesService.findAll();
  }

  @Patch(":id")
  @RequirePermission(AccessModule.TransportTypes, AccessAction.Update)
  update(@Param("id") id: string, @Body() dto: UpdateTransportTypeDto) {
    return this.transportTypesService.update(id, dto);
  }
}
