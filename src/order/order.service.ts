import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';
import { OrderCreateDto } from './dto/order-create-dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: OrderCreateDto, user: UserEntity): Promise<OrderEntity> {
    const items: OrderItemEntity[] = [];
    let total = 0;

    for (const item of dto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      const subtotal = Number(product.price) * item.quantity;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        subtotal,
      });

      items.push(orderItem);
      total += subtotal;
    }

    const order = this.orderRepository.create({
      user,
      status: 'pending',
      items,
      totalPrice: total,
    });

    return this.orderRepository.save(order);
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findByUser(userId: number): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
  }
}
