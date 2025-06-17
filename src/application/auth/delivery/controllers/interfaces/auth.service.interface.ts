import { Result } from 'src/application/core/types/result';
import { LoginDto } from '../../dtos/login.dto';
import { RegisterDto } from '../../dtos/register.dto';
import { UserResponseDto } from '../../dtos/user.dto';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<Result<UserResponseDto, Error>>;
  logout(): Promise<Result<void, Error>>;
  createUser(registerDto: RegisterDto): Promise<Result<UserResponseDto, Error>>;
  findAllUsers(): Promise<Result<UserResponseDto[], Error>>;
  findUserByEmail(
    email: string,
  ): Promise<Result<UserResponseDto | null, Error>>;
  deleteUser(email: string): Promise<Result<void, Error>>;
}
