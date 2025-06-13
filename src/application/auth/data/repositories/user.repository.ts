import { AuthDataSource } from '../../infrastructure/datasource/auth.datasource';
import { IUserRepository } from '../../use-cases/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { Inject } from '@nestjs/common';
import { Result } from 'src/application/core/types/result';

export class UserRepository implements IUserRepository {
  constructor(
    @Inject(AuthDataSource)
    private readonly authDataSource: AuthDataSource,
  ) {}
  async getAllUsers(): Promise<Result<User[], Error>> {
    const result = await this.authDataSource.findAll();
    if (result.type === 'error') {
      return { type: 'error', throwable: result.throwable };
    }
    return { type: 'success', value: result.value };
  }

  async getUserByEmail(email: string): Promise<Result<User | null, Error>> {
    const result = await this.authDataSource.findByEmail(email);
    if (result.type === 'error') {
      return { type: 'error', throwable: result.throwable };
    }
    if (result.value === null) {
      return { type: 'success', value: null };
    }
    return { type: 'success', value: result.value };
  }
  async deleteUser(uid: string): Promise<Result<void, Error>> {
    return await this.authDataSource.delete(uid);
  }

  async registerUser(
    email: string,
    password: string,
  ): Promise<Result<User, Error>> {
    return await this.authDataSource.register(email, password);
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<Result<string, Error>> {
    return await this.authDataSource.login(email, password);
  }

  async logoutUser(): Promise<Result<void, Error>> {
    return await this.authDataSource.logout();
  }
}
