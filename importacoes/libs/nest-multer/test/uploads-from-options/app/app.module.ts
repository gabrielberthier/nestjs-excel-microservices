import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { NestMulterModule } from '../../../src';
import { AppController } from './app.controller';

@Module({
  imports: [
    NestMulterModule.register({
      dest: join(process.cwd(), 'uploads'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
