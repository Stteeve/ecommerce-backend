import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductCreateDto } from './dto/product-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Post('create')
  async create(
    @Body() productCreateDto: ProductCreateDto,
  ): Promise<ProductEntity> {
    return this.productService.create(productCreateDto);
  }

  @Get('all')
  async findAll(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: ProductCreateDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.productService.delete(id);
  }
}
