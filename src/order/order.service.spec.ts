import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from '../product/product.entity';
import { Repository } from 'typeorm';
import { OrderCreateDto } from './dto/order-create-dto';
import { UserEntity } from '../user/user.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Partial<Record<keyof Repository<OrderEntity>, jest.Mock>>;
  let orderItemRepository: Partial<Record<keyof Repository<OrderItemEntity>, jest.Mock>>;
  let productRepository: Partial<Record<keyof Repository<ProductEntity>, jest.Mock>>;

  beforeEach(async () => {
    orderRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    orderItemRepository = {
      create: jest.fn(),
    };
    productRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(OrderEntity), useValue: orderRepository },
        { provide: getRepositoryToken(OrderItemEntity), useValue: orderItemRepository },
        { provide: getRepositoryToken(ProductEntity), useValue: productRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const user: UserEntity = { id: 1 } as UserEntity;
    const dto: OrderCreateDto = {
      items: [{ productId: 1, quantity: 2 }],
    };

    const fakeProduct = { id: 1, price: 10 };
    const fakeOrderItem = { product: fakeProduct, quantity: 2, subtotal: 20 };
    const fakeOrder = { id: 1, totalPrice: 20 };

    (productRepository.findOne as jest.Mock).mockResolvedValue(fakeProduct);
    (orderItemRepository.create as jest.Mock).mockReturnValue(fakeOrderItem);
    (orderRepository.create as jest.Mock).mockReturnValue(fakeOrder);
    (orderRepository.save as jest.Mock).mockResolvedValue(fakeOrder);

    const result = await service.create(dto, user);
    expect(result.totalPrice).toBe(20);
    expect(orderRepository.save).toHaveBeenCalled();
  });

  it('should find all orders', async () => {
    (orderRepository.find as jest.Mock).mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
    expect(orderRepository.find).toHaveBeenCalledWith({
      relations: ['user', 'items', 'items.product'],
    });
  });

  it('should find orders by user', async () => {
    (orderRepository.find as jest.Mock).mockResolvedValue([]);
    const result = await service.findByUser(1);
    expect(result).toEqual([]);
    expect(orderRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      relations: ['user', 'items', 'items.product'],
    });
  });
});