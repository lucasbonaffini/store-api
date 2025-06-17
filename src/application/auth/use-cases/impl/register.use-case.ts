import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { RegisterDto } from '../../delivery/dtos/register.dto';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(registerDto: RegisterDto): Promise<Result<{ user: User; token: string }, Error>> {
    return await this.userRepository.registerUser(
      registerDto.email,
      registerDto.password,
    );
  }
}
