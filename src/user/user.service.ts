import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, firstName, lastName } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return this.userRepository.save(newUser);
  }

  async registerAdmin(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, firstName, lastName } = createUserDto;
    const exisitingAdmin = await this.userRepository.findOne({
      where: { email },
    });
    if (exisitingAdmin) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'admin',
    });
    return this.userRepository.save(newAdmin);
  }

  async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
