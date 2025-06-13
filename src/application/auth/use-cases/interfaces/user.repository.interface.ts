import { User } from '../../domain/entities/user.entity';
import { Result } from 'src/application/core/types/result';

export interface IUserRepository {
  getAllUsers(): Promise<Result<User[], Error>>;
  getUserByEmail(email: string): Promise<Result<User | null, Error>>;
  createUser(user: User): Promise<Result<User, Error>>;
  deleteUser(id: string): Promise<Result<void, Error>>;
}
