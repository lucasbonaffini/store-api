import { Module } from '@nestjs/common';
import { AuthController } from './delivery/controllers/auth.controller';
import { AuthService } from './delivery/services/auth.service';
import { AuthDataSource } from './infrastructure/datasource/auth.datasource';
import { LoginUseCase } from './use-cases/impl/login.use-case';
import { RegisterUseCase } from './use-cases/impl/register.use-case';
import { LogoutUseCase } from './use-cases/impl/logout.use-case';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    AuthDataSource,
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
