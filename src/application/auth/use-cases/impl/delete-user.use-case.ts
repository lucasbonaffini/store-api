import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';
import { IDeleteUserUseCase } from '../../delivery/services/interfaces/user.use-case.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<Result<void, Error>> {
    return await this.userRepository.deleteUser(id);
  }
}
