import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check (DB + Redis)' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check() {
    return this.health.check();
  }
}
