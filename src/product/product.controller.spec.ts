import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product-create.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: Partial<Record<keyof ProductService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: service }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create product', async () => {
    const dto: ProductCreateDto = {
      name: 'Test',
      description: 'Desc',
      price: 10,
      stock: 5,
    };
    const expected = { id: 1, ...dto };
    (service.create as jest.Mock).mockResolvedValue(expected);

    const result = await controller.create(dto);
    expect(result).toEqual(expected);
  });

  it('should return all products', async () => {
    const expected = [{ id: 1 }];
    (service.findAll as jest.Mock).mockResolvedValue(expected);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
  });

  it('should return one product by id', async () => {
    const expected = { id: 1 };
    (service.findOne as jest.Mock).mockResolvedValue(expected);

    const result = await controller.findOne(1);
    expect(result).toEqual(expected);
  });

  it('should update a product', async () => {
    const dto: ProductCreateDto = {
      name: 'Updated',
      description: 'Updated Desc',
      price: 20,
      stock: 10,
    };
    const expected = { id: 1, ...dto };
    (service.update as jest.Mock).mockResolvedValue(expected);

    const result = await controller.update(1, dto);
    expect(result).toEqual(expected);
  });

  it('should delete a product', async () => {
    (service.delete as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.delete(1)).resolves.toBeUndefined();
  });
});