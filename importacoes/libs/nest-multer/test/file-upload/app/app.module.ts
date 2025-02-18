import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NestMulterModule } from '@app/nest-multer/nest-multer.module';

@Module({
  imports: [NestMulterModule],
  controllers: [AppController],
  exports: [NestMulterModule],
})
export class AppModule {}
