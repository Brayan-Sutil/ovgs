import { Injectable } from "@nestjs/common";
import { TransportTypesRepository } from "./transport-types.repository";
import { CreateTransportTypeDto } from "./dto/create-transport-type.dto";
import { UpdateTransportTypeDto } from "./dto/update-transport-type.dto";

@Injectable()
export class TransportTypesService {
  constructor(private readonly transportTypesRepository: TransportTypesRepository) {}

  create(dto: CreateTransportTypeDto) {
    return this.transportTypesRepository.create(dto);
  }

  findAll() {
    return this.transportTypesRepository.findAll();
  }

  update(id: string, dto: UpdateTransportTypeDto) {
    return this.transportTypesRepository.update(id, dto);
  }
}
