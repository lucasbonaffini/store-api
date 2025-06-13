import { Injectable } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { RegisterDto } from '../../delivery/dtos/register.dto';
import { UserResponseDto } from '../../delivery/dtos/user.dto';
import { auth } from '../../../product/infrastructure/datasources/firebase/config.firebase';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Injectable()
export class RegisterUseCase {
  async execute(
    registerDto: RegisterDto,
  ): Promise<Result<UserResponseDto, Error>> {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      registerDto.email,
      registerDto.password,
    );

    const token = await userCredential.user.getIdToken();

    const userResponse: UserResponseDto = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      token: token,
      createdAt: new Date(userCredential.user.metadata.creationTime!),
      updatedAt: new Date(userCredential.user.metadata.lastSignInTime!),
    };

    return { type: 'success', value: userResponse };
  }
}
