import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XlsxReaderModule } from './xlsx-reader/xlsx-reader.module';
import { NestMulterModule } from '@app/nest-multer';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [XlsxReaderModule, FileUploadModule, NestMulterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
