import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { join } from 'node:path';
import { AppModule } from './app/app.module';
import * as request from 'supertest';
import { fastifyMultipart } from '@fastify/multipart';

jest.setTimeout(60000);

describe('API Workflow', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.register(fastifyMultipart);

    await app.init();
    await app.listen(0);
    await app.getHttpAdapter().getInstance().ready();
  });

  it('Should validate Single File Upload', async () => {
    return request(app.getHttpServer())
      .post('/single')
      .attach('file', join(process.cwd(), 'package.json'))
      .expect(201)
      .expect({ success: true });
  });

  it('Should validate Multiple File Uploads', async () => {
    return request(app.getHttpServer())
      .post('/multiple')
      .attach('file', join(process.cwd(), 'package.json'))
      .attach('file', join(process.cwd(), 'eslint.config.mjs'))
      .field('nonFile', 'Hello World!')
      .expect(201)
      .expect({ success: true, fileCount: 2 });
  });

  it('Should validate Any File Upload', async () => {
    return request(app.getHttpServer())
      .post('/any')
      .set('content-type', 'multipart/form-data')
      .attach('fil', join(process.cwd(), 'package.json'))
      .field('field', 'value')
      .expect(201)
      .expect({ success: true, fileCount: 1 });
  });

  it('Should validate File Fields Upload - profile field', async () => {
    return request(app.getHttpServer())
      .post('/fields')
      .attach('profile', join(process.cwd(), 'package.json'))
      .expect(201)
      .expect({ success: true, fileCount: 1 });
  });

  it('File Fields Upload - avatar field', async () => {
    return request(app.getHttpServer())
      .post('/fields')
      .attach('avatar', join(process.cwd(), 'package.json'))
      .expect(201)
      .expect({ success: true, fileCount: 1 });
  });

  it('File Fields Upload - profile and avatar fields', async () => {
    return request(app.getHttpServer())
      .post('/fields')
      .attach('profile', join(process.cwd(), 'package.json'))
      .attach('avatar', join(process.cwd(), 'package.json'))
      .expect(201)
      .expect({ success: true, fileCount: 2 });
  });

  it('No File Upload - 201, no file', async () => {
    return request(app.getHttpServer())
      .post('/none')
      .field('no', 'files')
      .expect(201)
      .expect({ success: false });
  });

  it('No File Upload - 400, with file', async () => {
    return request(app.getHttpServer())
      .post('/none')
      .attach('file', join(process.cwd(), 'package.json'))
      .expect(400);
  });

  afterAll(async () => app.close());
});
