/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { DatabaseException } from '../exceptions';

@Injectable()
export class FirebaseErrorMapper {
  mapToDatabaseException(error: Error, operation: string): DatabaseException {
    if (this.isFirebaseError(error)) {
      return this.mapFirebaseError(error, operation);
    }

    return new DatabaseException(
      `Database operation failed: ${operation}`,
      error,
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

  private mapFirebaseError(error: any, operation: string): DatabaseException {
    const errorCode = error.code;
    const errorMessage = error.message;

    switch (errorCode) {
      case 'permission-denied':
        return new DatabaseException(
          `Permission denied during ${operation}. Check your Firestore security rules.`,
          error,
        );

      case 'not-found':
        return new DatabaseException(
          `Document not found during ${operation}. The document you're trying to access doesn't exist.`,
          error,
        );

      case 'already-exists':
        return new DatabaseException(
          `Document already exists during ${operation}. Cannot create duplicate document.`,
          error,
        );

      case 'resource-exhausted':
        return new DatabaseException(
          `Resource exhausted during ${operation}. Too many requests, please try again later.`,
          error,
        );

      case 'failed-precondition':
        return new DatabaseException(
          `Failed precondition during ${operation}. Operation cannot be performed in current state.`,
          error,
        );

      case 'out-of-range':
        return new DatabaseException(
          `Out of range error during ${operation}. Invalid parameter value.`,
          error,
        );

      case 'unimplemented':
        return new DatabaseException(
          `Unimplemented feature during ${operation}. This operation is not supported.`,
          error,
        );

      case 'internal':
        return new DatabaseException(
          `Internal server error during ${operation}. Please try again later.`,
          error,
        );

      case 'unavailable':
        return new DatabaseException(
          `Service unavailable during ${operation}. Firestore is temporarily unavailable.`,
          error,
        );

      case 'data-loss':
        return new DatabaseException(
          `Data loss detected during ${operation}. Unrecoverable data loss or corruption.`,
          error,
        );

      case 'unauthenticated':
        return new DatabaseException(
          `Unauthenticated request during ${operation}. Please authenticate and try again.`,
          error,
        );

      case 'invalid-argument':
        return new DatabaseException(
          `Invalid argument during ${operation}. ${errorMessage}`,
          error,
        );

      case 'deadline-exceeded':
        return new DatabaseException(
          `Deadline exceeded during ${operation}. The operation took too long to complete.`,
          error,
        );

      case 'cancelled':
        return new DatabaseException(
          `Operation cancelled during ${operation}. The operation was cancelled by the client.`,
          error,
        );

      default:
        return new DatabaseException(
          `Firebase error during ${operation}: ${errorMessage}`,
          error,
        );
    }
  }
}
