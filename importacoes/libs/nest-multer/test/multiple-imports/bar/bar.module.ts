import { Module } from '@nestjs/common';
import { diskStorage } from 'fastify-multer/lib';
import { NestMulterModule } from '../../../src';

@Module({
  imports: [
    NestMulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({ destination: '/tmp/uploads/' }),
      }),
    }),
  ],
})
export class BarModule {}
