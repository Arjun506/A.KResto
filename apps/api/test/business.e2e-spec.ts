import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';
import { UnknownExceptionFilter } from '../src/common/filters/unknown-exception.filter';
import { ValidationExceptionFilter } from '../src/common/filters/validation-exception.filter';

describe('Business Workspace API (e2e)', () => {
  let app: INestApplication<App>;
  const uniqueSuffix = Date.now();
  const ownerEmail = `owner.${uniqueSuffix}@example.com`;
  const businessName = `Milestone Bistro ${uniqueSuffix}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(
      new UnknownExceptionFilter(),
      new PrismaExceptionFilter(),
      new ValidationExceptionFilter(),
      new HttpExceptionFilter(),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/business/industries returns industry packs', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/business/industries')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(
      response.body.data.some(
        (item: { id: string }) => item.id === 'RESTAURANT',
      ),
    ).toBe(true);
  });

  it('GET /api/v1/business/currencies returns currency options', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/business/currencies')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(
      response.body.data.some((item: { code: string }) => item.code === 'USD'),
    ).toBe(true);
  });

  it('GET /api/v1/business/timezones returns timezone options', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/business/timezones')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(
      response.body.data.some((item: { id: string }) => item.id === 'UTC'),
    ).toBe(true);
  });

  it('GET /api/v1/business/check-name validates availability', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/business/check-name')
      .query({ name: businessName })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.available).toBe(true);
    expect(response.body.data.slug).toBeTruthy();
  });

  it('POST /api/v1/business/workspace provisions a workspace transactionally', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/business/workspace')
      .send({
        businessName,
        industry: 'RESTAURANT',
        ownerName: 'Workspace Owner',
        ownerEmail,
        ownerPassword: 'secret123',
        currency: 'USD',
        timezone: 'UTC',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.access_token).toBeTruthy();
    expect(response.body.data.business.name).toBe(businessName);
    expect(response.body.data.branch.code).toBe('MAIN');
    expect(response.body.data.subscription.status).toBe('TRIALING');
    expect(response.body.data.modules.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/business/workspace rejects duplicate business names', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/business/workspace')
      .send({
        businessName,
        industry: 'RESTAURANT',
        ownerName: 'Another Owner',
        ownerEmail: `duplicate.${uniqueSuffix}@example.com`,
        ownerPassword: 'secret123',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('POST /api/v1/business/workspace rejects duplicate owner emails', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/business/workspace')
      .send({
        businessName: `${businessName} Duplicate`,
        industry: 'RESTAURANT',
        ownerName: 'Workspace Owner',
        ownerEmail,
        ownerPassword: 'secret123',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('GET /api/v1/business/settings requires authentication', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/business/settings')
      .expect(401);
  });
});
