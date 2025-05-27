import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../product/product.entity';

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, { eager: true })
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 8, scale: 2 })
  subtotal: number;
}
