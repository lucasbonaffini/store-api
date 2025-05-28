import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import { IProductDataSource } from '../../../data/repositories/interfaces/product-datasource.interface';
import { PrismaService } from './prisma.service';
import { Result } from '../../../../core/types/result';

@Injectable()
export class PrismaProductDataSource implements IProductDataSource {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Result<Product[], Error>> {
    try {
      const products = await this.prisma.product.findMany();
      const productEntities = products.map(
        (product) =>
          new Product(
            product.id,
            product.title,
            product.price,
            product.description,
            product.category,
            product.image,
            product.stock,
            product.createdAt,
            product.updatedAt,
          ),
      );

      return { type: 'success', value: productEntities };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async findById(id: number): Promise<Result<Product | null, Error>> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return { type: 'success', value: null };
      }

      const productEntity = new Product(
        product.id,
        product.title,
        product.price,
        product.description,
        product.category,
        product.image,
        product.stock,
        product.createdAt,
        product.updatedAt,
      );

      return { type: 'success', value: productEntity };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async create(product: Product): Promise<Result<Product, Error>> {
    try {
      const createdProduct = await this.prisma.product.create({
        data: {
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          stock: product.stock,
        },
      });

      const productEntity = new Product(
        createdProduct.id,
        createdProduct.title,
        createdProduct.price,
        createdProduct.description,
        createdProduct.category,
        createdProduct.image,
        createdProduct.stock,
        createdProduct.createdAt,
        createdProduct.updatedAt,
      );

      return { type: 'success', value: productEntity };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async update(product: Product): Promise<Result<Product, Error>> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id: product.id },
        data: {
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          stock: product.stock,
        },
      });

      const productEntity = new Product(
        updatedProduct.id,
        updatedProduct.title,
        updatedProduct.price,
        updatedProduct.description,
        updatedProduct.category,
        updatedProduct.image,
        updatedProduct.stock,
        updatedProduct.createdAt,
        updatedProduct.updatedAt,
      );

      return { type: 'success', value: productEntity };
    } catch (error) {
      return { type: 'error', throwable: error as Error };
    }
  }

  async updateStock(
    id: number,
    stock: number,
  ): Promise<Result<Product, Error>> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { stock },
      });

      const productEntity = new Product(
        updatedProduct.id,
        updatedProduct.title,
        updatedProduct.price,
        updatedProduct.description,
        updatedProduct.category,
        updatedProduct.image,
        updatedProduct.stock,
        updatedProduct.createdAt,
        updatedProduct.updatedAt,
      );

      return { type: 'success', value: productEntity };
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
