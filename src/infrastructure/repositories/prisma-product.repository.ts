/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
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
  }

  async findById(id: number): Promise<Product | null> {
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
  }

  async create(product: Product): Promise<Product> {
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
  }

  async update(product: Product): Promise<Product> {
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
  }

  async updateStock(id: number, stock: number): Promise<Product> {
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
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id },
    });
    return count > 0;
  }
}
