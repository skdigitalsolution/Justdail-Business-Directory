import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ version: '8.0.46' }]),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should return app health with ok status', () => {
    const health = service.getAppHealth();
    expect(health.status).toBe('ok');
    expect(health.service).toBe('justdial-business-directory-api');
  });

  it('should return database health connected when query succeeds', async () => {
    const dbHealth = await service.getDatabaseHealth();
    expect(dbHealth.status).toBe('connected');
    expect(dbHealth.database).toBe('justdials-business');
    expect(dbHealth.version).toBe('8.0.46');
  });
});
