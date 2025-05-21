import { BadRequestException } from '@nestjs/common';

export class InvalidProductDataException extends BadRequestException {
  constructor(message: string = 'Invalid product data provided') {
    super(message);
  }
}
