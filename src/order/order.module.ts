import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
