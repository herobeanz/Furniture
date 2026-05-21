import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get dashboard data for admin UI' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  getDashboard(@Query('chartDays') chartDays?: string) {
    const days = chartDays === '30' ? 30 : 7;
    return this.reportsService.getDashboard(days);
  }
}
