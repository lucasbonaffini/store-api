import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundException extends NotFoundException {
  constructor(id: number | string) {
    super(`Product with ID ${id} not found`);
  }
}
