/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { auth } from '../../../product/infrastructure/datasources/firebase/config.firebase';
import { signOut } from 'firebase/auth';

@Injectable()
export class LogoutUseCase {
  async execute(): Promise<Result<void, Error>> {
    const result = await signOut(auth).catch((error: any) => ({
      type: 'error' as const,
      throwable: new Error(`Logout failed: ${error.message as string}`),
    }));

    if (result && typeof result === 'object' && 'type' in result) {
      return result;
    }

    return { type: 'success', value: undefined };
  }
}
