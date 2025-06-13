import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { User } from '../../domain/entities/user.entity';
import { IFindUserByEmailUseCase } from '../../delivery/services/interfaces/user.use-case.interface';
import { UserRepository } from '../../data/repositories/user.repository';

@Injectable()
export class FindUserByEmailUseCase implements IFindUserByEmailUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<Result<User | null, Error>> {
    return await this.userRepository.getUserByEmail(email);
  }
}
