/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { DatabaseException } from '../../domain/exceptions';

@Injectable()
export class PrismaErrorMapper {
  mapToDatabaseException(error: Error, operation: string): DatabaseException {
    // Mapeo específico para errores de Prisma
    if (this.isPrismaError(error)) {
      return this.mapPrismaError(error, operation);
    }

    return new DatabaseException(
      `Database operation failed: ${operation}`,
      error,
    );
  }

  private isPrismaError(error: Error): boolean {
    return (
      error.constructor.name.startsWith('Prisma') ||
      'code' in error ||
      'meta' in error
    );
  }

  private mapPrismaError(error: any, operation: string): DatabaseException {
    const errorCode = error.code;
    const errorMeta = error.meta;

    switch (errorCode) {
      case 'P2002':
        return new DatabaseException(
          `Unique constraint violation during ${operation}. ${this.getConstraintMessage(errorMeta)}`,
          error,
        );

      case 'P2025':
        return new DatabaseException(
          `Record not found during ${operation}. The record you're trying to ${operation.toLowerCase()} doesn't exist.`,
          error,
        );

      case 'P2003':
        return new DatabaseException(
          `Foreign key constraint violation during ${operation}. ${this.getForeignKeyMessage(errorMeta)}`,
          error,
        );

      case 'P2021':
        return new DatabaseException(
          `Table does not exist during ${operation}. Please check your database schema.`,
          error,
        );

      case 'P2022':
        return new DatabaseException(
          `Column does not exist during ${operation}. Please check your database schema.`,
          error,
        );

      case 'P1001':
        return new DatabaseException(
          `Cannot connect to database during ${operation}. Please check your database connection.`,
          error,
        );

      case 'P1002':
        return new DatabaseException(
          `Database connection timeout during ${operation}. Please try again later.`,
          error,
        );

      case 'P2004':
        return new DatabaseException(
          `Database constraint violation during ${operation}. ${error.message}`,
          error,
        );

      default:
        return new DatabaseException(
          `Database error during ${operation}: ${error.message}`,
          error,
        );
    }
  }

  private getConstraintMessage(meta: any): string {
    if (meta?.target) {
      const fields = Array.isArray(meta.target)
        ? meta.target.join(', ')
        : meta.target;
      return `The value for field(s) '${fields}' already exists.`;
    }
    return 'A unique constraint was violated.';
  }

  private getForeignKeyMessage(meta: any): string {
    if (meta?.field_name) {
      return `The referenced record in field '${meta.field_name}' does not exist.`;
    }
    return 'A foreign key constraint was violated.';
  }
}
