import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HealthService, HealthResponse, DatabaseHealthResponse } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Backend availability check' })
  @ApiResponse({
    status: 200,
    description: 'API service is running and healthy.',
  })
  getHealth(): HealthResponse {
    return this.healthService.getAppHealth();
  }

  @Get('database')
  @ApiOperation({ summary: 'Real MySQL connection check via Prisma' })
  @ApiResponse({
    status: 200,
    description: 'MySQL database is reachable and active.',
  })
  @ApiResponse({
    status: 503,
    description: 'MySQL database connection failed or unreachable.',
  })
  async getDatabaseHealth(@Res() res: Response): Promise<void> {
    const health: DatabaseHealthResponse = await this.healthService.getDatabaseHealth();
    if (health.status === 'connected') {
      res.status(HttpStatus.OK).json(health);
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(health);
    }
  }
}
