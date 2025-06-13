import { Result } from 'src/application/core/types/result';
import { User } from 'src/application/auth/domain/entities/user.entity';

export interface IUserDataSource {
  findByEmail(email: string): Promise<Result<User, Error>>;
  findAll(): Promise<Result<User[], Error>>;
  create(user: User): Promise<Result<User, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
