import { Module } from '@nestjs/common';
import { AuthController } from './delivery/controllers/auth.controller';
import { AuthService } from './delivery/services/auth.service';
import { AuthDataSource } from './infrastructure/datasource/auth.datasource';
import { UserRepository } from './data/repositories/user.repository';
import { LoginUseCase } from './use-cases/impl/login.use-case';
import { RegisterUseCase } from './use-cases/impl/register.use-case';
import { LogoutUseCase } from './use-cases/impl/logout.use-case';
import { GetUserByEmailUseCase } from './use-cases/impl/get-use-by-email.use-case';
import { GetUsersUseCase } from './use-cases/impl/get-users.use-case';
import { DeleteUserUseCase } from './use-cases/impl/delete-user.use-case';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    AuthDataSource,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    LoginUseCase,
    {
      provide: 'ILoginUserUseCase',
      useClass: LoginUseCase,
    },
    RegisterUseCase,
    {
      provide: 'IRegisterUseCase',
      useClass: RegisterUseCase,
    },
    LogoutUseCase,
    {
      provide: 'ILogoutUserUseCase',
      useClass: LogoutUseCase,
    },
    GetUserByEmailUseCase,
    {
      provide: 'IFindUserByEmailUseCase',
      useClass: GetUserByEmailUseCase,
    },
    GetUsersUseCase,
    {
      provide: 'IGetUsersUseCase',
      useClass: GetUsersUseCase,
    },
    DeleteUserUseCase,
    {
      provide: 'IDeleteUserUseCase',
      useClass: DeleteUserUseCase,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
