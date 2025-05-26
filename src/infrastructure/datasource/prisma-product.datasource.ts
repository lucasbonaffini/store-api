import { Injectable } from '@nestjs/common';
import { Product } from '../../application/product/domain/entities/product.entity';
import { IProductDataSource } from './interfaces/product-datasource.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { DatabaseException } from '../../application/product/domain/exceptions';

@Injectable()
export class PrismaProductDataSource implements IProductDataSource {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany();
      return products.map(
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
    } catch (error) {
      throw new DatabaseException(
        'Error fetching products from database',
        error,
      );
    }
  }

  async findById(id: number): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return null;
      }

      return new Product(
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
    } catch (error) {
      throw new DatabaseException(
        `Error fetching product with id ${id}`,
        error,
      );
    }
  }

  async create(product: Product): Promise<Product> {
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

      return new Product(
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
    } catch (error) {
      throw new DatabaseException('Error creating product in database', error);
    }
  }

  async update(product: Product): Promise<Product> {
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

      return new Product(
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
    } catch (error) {
      throw new DatabaseException(
        `Error updating product with id ${product.id}`,
        error,
      );
    }
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { stock },
      });

      return new Product(
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
    } catch (error) {
      throw new DatabaseException(
        `Error updating stock for product with id ${id}`,
        error,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseException(
        `Error deleting product with id ${id}`,
        error,
      );
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const count = await this.prisma.product.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      throw new DatabaseException(
        `Error checking if product exists with id ${id}`,
        error,
      );
    }
  }
}
