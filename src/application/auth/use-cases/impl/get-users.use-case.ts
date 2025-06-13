import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { User } from '../../domain/entities/user.entity';
import { IGetUsersUseCase } from '../../delivery/services/interfaces/user.use-case.interface';
import { UserRepository } from '../../data/repositories/user.repository';

@Injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<Result<User[], Error>> {
    return await this.userRepository.getAllUsers();
  }
}
