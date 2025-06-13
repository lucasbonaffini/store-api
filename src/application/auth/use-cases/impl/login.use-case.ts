/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { LoginDto } from '../../delivery/dtos/login.dto';
import { UserResponseDto } from '../../delivery/dtos/user.dto';
import { auth } from '../../../product/infrastructure/datasources/firebase/config.firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Injectable()
export class LoginUseCase {
  async execute(loginDto: LoginDto): Promise<Result<UserResponseDto, Error>> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginDto.email,
      loginDto.password,
    ).catch((error: any) => ({
      type: 'error' as const,
      throwable: new Error(`Login failed: ${error.message as string}`),
    }));

    if ('type' in userCredential && userCredential.type === 'error') {
      return userCredential;
    }

    const token = await (userCredential as UserCredential).user.getIdToken();

    const userResponse: UserResponseDto = {
      uid: (userCredential as UserCredential).user.uid,
      email: (userCredential as UserCredential).user.email!,
      token: token,
      createdAt: new Date(
        (userCredential as UserCredential).user.metadata.creationTime!,
      ),
      updatedAt: new Date(
        (userCredential as UserCredential).user.metadata.lastSignInTime!,
      ),
    };

    return { type: 'success', value: userResponse };
  }
}
