import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('fake-secret'),
    };

    strategy = new JwtStrategy(configService as ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return user payload', async () => {
    const payload = {
      sub: 1,
      email: 'test@example.com',
      role: 'user',
    };

    const result = await strategy.validate(payload);
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'user',
    });
  });
});