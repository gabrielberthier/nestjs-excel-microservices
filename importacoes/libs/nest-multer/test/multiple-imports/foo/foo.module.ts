import { Module } from '@nestjs/common';
import { memoryStorage } from 'fastify-multer/lib';
import { NestMulterModule } from '../../../src';

@Module({
  imports: [
    NestMulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
  ],
})
export class FooModule {}
