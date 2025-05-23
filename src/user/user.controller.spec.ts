import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      register: jest.fn(),
      login: jest.fn(),
      registerAdmin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };
    const expectedResult = { id: 1, ...dto };
    (service.register as jest.Mock).mockResolvedValue(expectedResult);

    const result = await controller.register(dto);
    expect(result).toEqual(expectedResult);
  });

  it('should login a user', async () => {
    const dto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password',
    };
    (service.login as jest.Mock).mockResolvedValue({ accessToken: 'abc123' });

    const result = await controller.login(dto);
    expect(result.accessToken).toBe('abc123');
  });

  it('should register an admin', async () => {
    const dto: CreateUserDto = {
      email: 'admin@example.com',
      password: 'adminpass',
      firstName: 'Admin',
      lastName: 'User',
    };
    const expected = { id: 2, ...dto, role: 'admin' };
    (service.registerAdmin as jest.Mock).mockResolvedValue(expected);

    const result = await controller.registerAdmin(dto);
    expect(result).toEqual(expected);
  });
});