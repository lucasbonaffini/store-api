import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { User } from '../../domain/entities/user.entity';
import { IFindUserByEmailUseCase } from '../../delivery/services/interfaces/user.use-case.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class GetUserByEmailUseCase implements IFindUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<Result<User | null, Error>> {
    return await this.userRepository.getUserByEmail(email);
  }
}
