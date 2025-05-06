import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Singleton pattern to avoid multiple instances
  private static instance: PrismaService;

  constructor() {
    // Pass minimal options to avoid issues
    super({
      log: ['error', 'warn'],
    });

    // Safe singleton implementation
    if (PrismaService.instance) {
      return PrismaService.instance;
    }

    PrismaService.instance = this;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connected successfully via Prisma');
    } catch (error) {
      console.error('Prisma connection error:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Prisma disconnect error:', error);
    }
  }
}
