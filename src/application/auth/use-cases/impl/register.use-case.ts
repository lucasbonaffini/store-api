import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { RegisterDto } from '../../delivery/dtos/register.dto';
import { UserResponseDto } from '../../delivery/dtos/user.dto';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { auth } from '../../../product/infrastructure/datasources/firebase/config.firebase';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    registerDto: RegisterDto,
  ): Promise<Result<UserResponseDto, Error>> {
    const result = await this.userRepository.registerUser(
      registerDto.email,
      registerDto.password,
    );

    if (result.type === 'error') {
      return result;
    }

    const token = await auth.currentUser?.getIdToken();

    const userResponse: UserResponseDto = {
      uid: result.value.id,
      email: result.value.email,
      token: token || '',
      createdAt: result.value.createdAt,
      updatedAt: result.value.updatedAt,
    };

    return { type: 'success', value: userResponse };
  }
}
