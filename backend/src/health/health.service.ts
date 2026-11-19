import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
  version: string;
}

export interface DatabaseHealthResponse {
  status: 'connected' | 'error';
  database: string;
  provider: 'mysql';
  latencyMs?: number;
  version?: string;
  timestamp: string;
  error?: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  getAppHealth(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      environment: process.env.NODE_ENV || 'development',
      service: 'justdial-business-directory-api',
      version: '1.0.0',
    };
  }

  async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    const start = Date.now();
    try {
      // Execute a real MySQL connectivity query using Prisma $queryRaw
      const result = await this.prisma.$queryRaw<Array<{ version: string }>>`SELECT VERSION() as version;`;
      const latencyMs = Date.now() - start;
      const version = result && result[0] ? result[0].version : '8.0';

      return {
        status: 'connected',
        database: 'justdials-business',
        provider: 'mysql',
        latencyMs,
        version,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const latencyMs = Date.now() - start;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown database connection error';

      this.logger.error(`Database connection check failed: ${errorMessage}`);

      return {
        status: 'error',
        database: 'justdials-business',
        provider: 'mysql',
        latencyMs,
        timestamp: new Date().toISOString(),
        error: 'Database connection failed. Please ensure MySQL is running on 127.0.0.1:3306 and backend/.env contains valid credentials.',
      };
    }
  }
}
