import { User } from '../../domain/entities/user.entity';
import { Result } from 'src/application/core/types/result';

export interface IUserRepository {
  getAllUsers(): Promise<Result<User[], Error>>;
  getUserByEmail(email: string): Promise<Result<User | null, Error>>;
  deleteUser(uid: string): Promise<Result<void, Error>>;
  registerUser(email: string, password: string): Promise<Result<User, Error>>;
  loginUser(email: string, password: string): Promise<Result<User, Error>>;
  logoutUser(): Promise<Result<void, Error>>;
}
