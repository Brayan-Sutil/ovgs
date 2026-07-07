import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { ItemsRepository } from "./items.repository";

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  create(dto: CreateItemDto) {
    return this.itemsRepository.create(dto);
  }

  findAll() {
    return this.itemsRepository.findAll();
  }
}
