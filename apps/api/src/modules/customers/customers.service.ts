import { Injectable } from "@nestjs/common";
import { CustomersRepository } from "./customers.repository";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  create(dto: CreateCustomerDto) {
    return this.customersRepository.create(dto);
  }

  findAll() {
    return this.customersRepository.findAll();
  }

  update(id: string, dto: UpdateCustomerDto) {
    return this.customersRepository.update(id, dto);
  }
}
