import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  getOverview() {
    return this.reportsService.getOverview();
  }

  @Get('inquiries')
  @UseGuards(JwtAuthGuard)
  getInquiriesStats() {
    return this.reportsService.getInquiriesStats();
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  getProductsStats() {
    return this.reportsService.getProductsStats();
  }
}
