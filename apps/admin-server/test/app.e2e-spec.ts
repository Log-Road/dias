import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AdminServerModule } from './../src/admin-server.module';

describe('AdminServerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AdminServerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/club (POST)', () => {
    return request(app.getHttpServer())
      .post('/club')
      .expect(201)
      .expect('Hello World!');
  });
});
