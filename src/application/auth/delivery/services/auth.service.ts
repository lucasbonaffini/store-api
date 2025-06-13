import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../controllers/interfaces/auth.service.interface';
import { LoginDto } from '../dtos/login.dto';
import { Result } from 'src/application/core/types/result';
import { RegisterDto } from '../dtos/register.dto';
import { UserResponseDto } from '../dtos/user.dto';
import { AuthDataSource } from '../../infrastructure/datasource/auth.datasource';
import {
  ILoginUserUseCase,
  IRegisterUserUseCase,
  ILogoutUserUseCase,
  IFindUserByEmailUseCase,
  IGetUsersUseCase,
  IDeleteUserUseCase,
} from './interfaces/user.use-case.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authDataSource: AuthDataSource,
    @Inject('ILoginUserUseCase')
    private readonly loginUseCase: ILoginUserUseCase,
    @Inject('IRegisterUseCase')
    private readonly registerUseCase: IRegisterUserUseCase,
    @Inject('ILogoutUserUseCase')
    private readonly logoutUseCase: ILogoutUserUseCase,
    @Inject('IFindUserByEmailUseCase')
    private readonly findUserByEmailUseCase: IFindUserByEmailUseCase,
    @Inject('IGetUsersUseCase')
    private readonly getUsersUseCase: IGetUsersUseCase,
    @Inject('IDeleteUserUseCase')
    private readonly deleteUserUseCase: IDeleteUserUseCase,
  ) {}
  async login(loginDto: LoginDto): Promise<Result<UserResponseDto, Error>> {
    const result = await this.loginUseCase.execute(loginDto);
    if (result.type === 'error') {
      return { type: 'error', throwable: result.throwable };
    }
    return { type: 'success', value: result.value };
  }

  async logout(): Promise<Result<void, Error>> {
    return await this.logoutUseCase.execute();
  }

  async createUser(
    registerDto: RegisterDto,
  ): Promise<Result<UserResponseDto, Error>> {
    return await this.registerUseCase.execute(registerDto);
  }
  async findAllUsers(): Promise<Result<UserResponseDto[], Error>> {
    try {
      const result = await this.getUsersUseCase.execute();
      if (result.type === 'error') {
        return result;
      }

      const userResponseDtos: UserResponseDto[] = result.value.map((user) => ({
        uid: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return { type: 'success', value: userResponseDtos };
    } catch (error) {
      return {
        type: 'error',
        throwable: new Error(
          `Failed to get users: ${(error as Error).message}`,
        ),
      };
    }
  }

  async findUserByEmail(
    email: string,
  ): Promise<Result<UserResponseDto | null, Error>> {
    return this.findUserByEmailUseCase.execute(email);
  }

  async deleteUser(email: string): Promise<Result<void, Error>> {
    return this.deleteUserUseCase.execute(email);
  }
}
