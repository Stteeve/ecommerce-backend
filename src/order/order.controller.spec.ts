import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/order-create-dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: Partial<Record<keyof OrderService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: service }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order', async () => {
    const dto: OrderCreateDto = { items: [{ productId: 1, quantity: 2 }] };
    const user = { id: 1, sub: 1 };
    const expected = { id: 1, totalPrice: 20 };
    (service.create as jest.Mock).mockResolvedValue(expected);

    const result = await controller.create(dto, { user });
    expect(result).toEqual(expected);
  });

  it('should find all orders', async () => {
    const expected = [{ id: 1 }, { id: 2 }];
    (service.findAll as jest.Mock).mockResolvedValue(expected);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
  });

  it('should find my orders', async () => {
    const expected = [{ id: 3 }];
    (service.findByUser as jest.Mock).mockResolvedValue(expected);

    const result = await controller.findMyOrder({ user: { sub: 1 } });
    expect(result).toEqual(expected);
  });
});
