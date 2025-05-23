import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { ProductCreateDto } from './dto/product-create.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Partial<Record<keyof Repository<ProductEntity>, jest.Mock>>;

  beforeEach(async () => {
    productRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto: ProductCreateDto = {
      name: 'Test Product',
      description: 'Test Desc',
      price: 99.99,
      stock: 100,
    };

    const created = { id: 1, ...dto };

    (productRepo.create as jest.Mock).mockReturnValue(dto);
    (productRepo.save as jest.Mock).mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
  });

  it('should find all products', async () => {
    const expected = [{ id: 1 }, { id: 2 }];
    (productRepo.find as jest.Mock).mockResolvedValue(expected);
    const result = await service.findAll();
    expect(result).toEqual(expected);
  });

  it('should find a product by id', async () => {
    const expected = { id: 1 };
    (productRepo.findOne as jest.Mock).mockResolvedValue(expected);
    const result = await service.findOne(1);
    expect(result).toEqual(expected);
  });

  it('should throw if product not found', async () => {
    (productRepo.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a product', async () => {
    const existing = { id: 1, name: 'Old', description: 'Old Desc', price: 10, stock: 5 };
    const update: ProductCreateDto = {
      name: 'New',
      description: 'New Desc',
      price: 20,
      stock: 10,
    };
    const updated = { id: 1, ...update };

    (service.findOne as any) = jest.fn().mockResolvedValue(existing);
    (productRepo.save as jest.Mock).mockResolvedValue(updated);

    const result = await service.update(1, update);
    expect(result).toEqual(updated);
  });

  it('should delete a product', async () => {
    const existing = { id: 1 };
    (service.findOne as any) = jest.fn().mockResolvedValue(existing);
    (productRepo.remove as jest.Mock).mockResolvedValue(undefined);

    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(productRepo.remove).toHaveBeenCalledWith(existing);
  });
});