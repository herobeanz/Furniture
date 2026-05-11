import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../shared/modules/redis.service';

export interface HealthResult {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  database: 'up' | 'down';
  redis: 'up' | 'down' | 'disabled';
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthResult> {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    let database: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }

    let redis: 'up' | 'down' | 'disabled' = 'disabled';
    if (this.redis.isEnabled) {
      redis = (await this.redis.ping()) ? 'up' : 'down';
    }

    const status: HealthResult['status'] =
      database === 'up' ? (redis === 'down' && this.redis.isEnabled ? 'degraded' : 'ok') : 'degraded';

    return {
      status,
      timestamp,
      uptime: Math.floor(uptime),
      database,
      redis,
    };
  }
}
