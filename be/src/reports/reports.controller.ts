import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get dashboard overview stats' })
  @ApiResponse({ status: 200, description: 'Overview stats retrieved' })
  getOverview() {
    return this.reportsService.getOverview();
  }

  @Get('inquiries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get inquiry statistics' })
  @ApiResponse({ status: 200, description: 'Inquiry stats retrieved' })
  getInquiriesStats() {
    return this.reportsService.getInquiriesStats();
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get product statistics' })
  @ApiResponse({ status: 200, description: 'Product stats retrieved' })
  getProductsStats() {
    return this.reportsService.getProductsStats();
  }
}
