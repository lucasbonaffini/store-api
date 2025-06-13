import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserResponseDto } from '../dtos/user.dto';
import { IAuthService } from './interfaces/auth.service.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiParam({
    name: 'loginDto',
    required: true,
    description: 'Login credentials',
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ message: string }> {
    await this.authService.login(loginDto);
    return { message: 'Login successful' };
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Registration failed' })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    await this.authService.createUser(registerDto);
    return { message: 'User created successfully' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(): Promise<{ message: string }> {
    await this.authService.logout();
    return { message: 'Logout successful' };
  }
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAllUsers() {
    return await this.authService.findAllUsers();
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'Email of the user to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findUserByEmail(@Body('email') email: string) {
    return await this.authService.findUserByEmail(email);
  }
}
