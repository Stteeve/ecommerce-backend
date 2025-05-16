import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductCreateDto } from './dto/product-create.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(productCreateDTO: ProductCreateDto): Promise<ProductEntity> {
    const product = this.productRepository.create(productCreateDTO);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: ProductCreateDto): Promise<ProductEntity> {
    const product = await this.findOne(id);
    const updatedProduct = Object.assign(product, dto);
    return this.productRepository.save(updatedProduct);
  }

  async delete(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
