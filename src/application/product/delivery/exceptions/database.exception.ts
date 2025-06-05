export class DatabaseException extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseException';
  }

  getDetails(): {
    message: string;
    originalError: string | null;
    timestamp: string;
  } {
    let errorMessage: string | null = null;

    if (this.originalError instanceof Error) {
      errorMessage = this.originalError.message;
    } else if (typeof this.originalError === 'string') {
      errorMessage = this.originalError;
    } else if (this.originalError) {
      errorMessage = JSON.stringify(this.originalError);
    }

    return {
      message: this.message,
      originalError: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}
