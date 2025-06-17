import { Result } from 'src/application/core/types/result';
import { User } from 'src/application/auth/domain/entities/user.entity';

export interface IUserDataSource {
  findByEmail(email: string): Promise<Result<User | null, Error>>;
  findAll(): Promise<Result<User[], Error>>;
  delete(uid: string): Promise<Result<void, Error>>;
  exists(email: string): Promise<Result<boolean, Error>>;
  register(email: string, password: string): Promise<Result<{ user: User; token: string }, Error>>;
  login(email: string, password: string): Promise<Result<string, Error>>;
  logout(): Promise<Result<void, Error>>;
}
