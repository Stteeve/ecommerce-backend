import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Partial<Record<keyof Repository<UserEntity>, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(undefined);
      (userRepository.create as jest.Mock).mockReturnValue(dto);
      (userRepository.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await service.register(dto);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id');
    });
  });

  describe('login', () => {
    it('should return a token for valid user', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: 1,
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        role: 'user',
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('test-token');

      const result = await service.login(dto);
      expect(result.accessToken).toBe('test-token');
    });
  });
});
