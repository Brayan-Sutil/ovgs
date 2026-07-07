import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTransportTypeDto } from "./dto/create-transport-type.dto";
import { UpdateTransportTypeDto } from "./dto/update-transport-type.dto";
import { TransportTypesService } from "./transport-types.service";

@ApiTags("transport-types")
@Controller("transport-types")
export class TransportTypesController {
  constructor(private readonly transportTypesService: TransportTypesService) {}

  @Post()
  create(@Body() dto: CreateTransportTypeDto) {
    return this.transportTypesService.create(dto);
  }

  @Get()
  findAll() {
    return this.transportTypesService.findAll();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTransportTypeDto) {
    return this.transportTypesService.update(id, dto);
  }
}
