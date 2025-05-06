import { ServiceUnavailableException } from '@nestjs/common';

export class ExternalServiceException extends ServiceUnavailableException {
  constructor(serviceName: string, error?: Error) {
    super(
      `Error communicating with external service: ${serviceName}. ${
        error ? error.message : ''
      }`,
    );
  }
}