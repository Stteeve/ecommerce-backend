import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/order-create-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/role.decorator';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() orderCreateDto: OrderCreateDto, @Req() req) {
    return this.orderService.create(orderCreateDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myorder')
  async findMyOrder(@Req() req) {
    return this.orderService.findByUser(req.user.sub);
  }
}
