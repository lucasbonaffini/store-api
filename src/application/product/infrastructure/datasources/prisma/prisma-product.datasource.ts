import { Injectable } from '@nestjs/common';
import { IProductDataSource } from '../../../data/repositories/interfaces/product-datasource.interface';
import { PrismaService } from './prisma.service';
import { Result } from '../../../../core/types/result';
import {
  PrismaProductDto,
  CreatePrismaProductDto,
} from 'src/application/product/delivery/dtos/prisma-product.dto';

@Injectable()
export class PrismaProductDataSource implements IProductDataSource {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Result<PrismaProductDto[], Error>> {
    try {
      const products = await this.prisma.product.findMany();
      return { type: 'success', value: products };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async findById(id: number): Promise<Result<PrismaProductDto | null, Error>> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      return { type: 'success', value: product };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async create(
    productData: CreatePrismaProductDto,
  ): Promise<Result<PrismaProductDto, Error>> {
    try {
      const createdProduct = await this.prisma.product.create({
        data: productData,
      });
      return { type: 'success', value: createdProduct };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async update(
    id: number,
    productData: Partial<CreatePrismaProductDto>,
  ): Promise<Result<PrismaProductDto, Error>> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: productData,
      });
      return { type: 'success', value: updatedProduct };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async updateStock(
    id: number,
    stock: number,
  ): Promise<Result<PrismaProductDto, Error>> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { stock },
      });
      return { type: 'success', value: updatedProduct };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async delete(id: number): Promise<Result<void, Error>> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return { type: 'success', value: undefined };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async exists(id: number): Promise<Result<boolean, Error>> {
    try {
      const count = await this.prisma.product.count({
        where: { id },
      });
      return { type: 'success', value: count > 0 };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }
}
