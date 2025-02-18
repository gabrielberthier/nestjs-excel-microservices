import { Test } from '@nestjs/testing';
import { unlink } from 'fs/promises';
import { join } from 'node:path';
import { AppModule } from './app/app.module';
import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';

describe('Fastify File Upload with Module Options', () => {
  let filePath = '';
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modRef.createNestApplication(new FastifyAdapter());
    await app.register(fastifyMultipart);
    await app.listen(0);
  });

  it('It should upload the file to the disk', async () => {
    await request(app.getHttpServer())
      .post('/')
      .attach('file', join(process.cwd(), 'package.json'))
      .expect(201)
      .expect((res) => {
        const hasFileName = (body: unknown): body is { filename: string } =>
          body !== null &&
          typeof body === 'object' &&
          'filename' in body &&
          typeof body.filename === 'string';

        if (hasFileName(res.body)) {
          filePath = res.body.filename;
        }
        expect(filePath).not.toBe('');
      });
  });

  afterAll(async () => {
    await unlink(join(process.cwd(), 'uploads', filePath));
    await app.close();
  });
});
