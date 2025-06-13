import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { IDeleteUserUseCase } from '../../delivery/services/interfaces/user.use-case.interface';
import { UserRepository } from '../../data/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return await this.userRepository.deleteUser(id);
  }
}
