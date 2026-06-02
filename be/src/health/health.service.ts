import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthResult {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  database: 'up' | 'down';
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

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

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      timestamp,
      uptime: Math.floor(uptime),
      database,
    };
  }
}
