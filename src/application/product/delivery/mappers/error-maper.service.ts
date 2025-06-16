import { Injectable, Inject } from '@nestjs/common';
import { FirebaseErrorMapper } from './firebase-error.mapper';
import {
  ProductNotFoundException,
  ExternalServiceException,
  DatabaseException,
} from '../exceptions';

@Injectable()
export class ErrorMapperService {
  constructor(
    @Inject(FirebaseErrorMapper)
    private readonly firebaseErrorMapper: FirebaseErrorMapper,
  ) {}

  mapError(
    error: Error,
    operation: string,
    context?: Record<string, any>,
  ): Error {
    if (this.isDomainError(error)) {
      return error;
    }

    if (this.isFirebaseError(error)) {
      return this.firebaseErrorMapper.mapToDatabaseException(error, operation);
    }

    if (this.isNetworkError(error)) {
      return new ExternalServiceException('External Service', error);
    }

    if (this.isDatabaseError(error)) {
      const contextInfo = context ? ` Context: ${JSON.stringify(context)}` : '';
      return new DatabaseException(
        `Database operation failed: ${operation}.${contextInfo}`,
        error,
      );
    }

    const contextInfo = context ? ` Context: ${JSON.stringify(context)}` : '';
    return new DatabaseException(
      `Unexpected error during ${operation}: ${error.message}.${contextInfo}`,
      error,
    );
  }

  mapProductFetchError(error: Error): Error {
    return this.mapError(error, 'fetch products');
  }

  mapProductFetchByIdError(error: Error, id: string): Error {
    return this.mapError(error, `fetch product with id ${id}`, {
      productId: id,
    });
  }

  mapProductCreateError(error: Error): Error {
    return this.mapError(error, 'create product');
  }

  mapProductUpdateError(error: Error, id: string): Error {
    return this.mapError(error, `update product with id ${id}`, {
      productId: id,
    });
  }

  mapStockUpdateError(error: Error, id: string): Error {
    return this.mapError(error, `update stock for product with id ${id}`, {
      productId: id,
    });
  }

  mapProductDeleteError(error: Error, id: string): Error {
    return this.mapError(error, `delete product with id ${id}`, {
      productId: id,
    });
  }

  private isDomainError(error: Error): boolean {
    return (
      error instanceof ProductNotFoundException ||
      error instanceof ExternalServiceException ||
      error instanceof DatabaseException
    );
  }

  private isFirebaseError(error: Error): boolean {
    return (
      error.name.includes('Firebase') ||
      error.message.includes('firebase') ||
      error.message.includes('firestore') ||
      'code' in error ||
      'details' in error
    );
  }

  private isNetworkError(error: Error): boolean {
    return (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('Network') ||
      error.name === 'FetchError' ||
      error.name === 'AxiosError'
    );
  }

  private isDatabaseError(error: Error): boolean {
    return (
      error.message.includes('database') ||
      error.message.includes('connection') ||
      error.name.includes('DB') ||
      error.name.includes('SQL') ||
      error.name.includes('Firebase') ||
      error.message.includes('firestore')
    );
  }
}
