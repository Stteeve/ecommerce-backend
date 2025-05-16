import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.login(loginUserDto);
  }

  @Post('register-admin')
  async registerAdmin(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.registerAdmin((createUserDto))
  }
}
