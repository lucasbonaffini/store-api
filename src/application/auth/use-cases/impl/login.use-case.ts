import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { LoginDto } from '../../delivery/dtos/login.dto';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(loginDto: LoginDto): Promise<Result<string, Error>> {
    return await this.userRepository.loginUser(
      loginDto.email,
      loginDto.password,
    );
  }
}
