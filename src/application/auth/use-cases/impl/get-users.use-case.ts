import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { User } from '../../domain/entities/user.entity';
import { IGetUsersUseCase } from '../../delivery/services/interfaces/user.use-case.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<Result<User[], Error>> {
    return await this.userRepository.getAllUsers();
  }
}
