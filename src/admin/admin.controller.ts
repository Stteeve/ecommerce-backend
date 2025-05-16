import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../auth/role.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('admin')
  @Get('protected')
  getProtected() {
    return { message: 'one admin can see' };
  }
}
