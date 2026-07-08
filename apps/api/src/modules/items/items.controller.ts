import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccessAction, AccessModule } from "../../common/access-control/access-control.types";
import { RequirePermission } from "../../common/access-control/require-permission.decorator";
import { CreateItemDto } from "./dto/create-item.dto";
import { ItemsService } from "./items.service";

@ApiTags("items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @RequirePermission(AccessModule.Items, AccessAction.Create)
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Get()
  @RequirePermission(AccessModule.Items, AccessAction.Read)
  findAll() {
    return this.itemsService.findAll();
  }
}
