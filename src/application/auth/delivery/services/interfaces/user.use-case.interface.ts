import { Result } from 'src/application/core/types/result';
import { User } from 'src/application/auth/domain/entities/user.entity';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { UserResponseDto } from '../../dtos/user.dto';

export interface IGetUsersUseCase {
  execute(): Promise<Result<User[], Error>>;
}

export interface IRegisterUserUseCase {
  execute(registerDto: RegisterDto): Promise<Result<UserResponseDto, Error>>;
}

export interface ILoginUserUseCase {
  execute(loginDto: LoginDto): Promise<Result<string, Error>>;
}

export interface ILogoutUserUseCase {
  execute(): Promise<Result<void, Error>>;
}

export interface IFindUserByEmailUseCase {
  execute(email: string): Promise<Result<User | null, Error>>;
}

export interface IDeleteUserUseCase {
  execute(id: string): Promise<Result<void, Error>>;
}
