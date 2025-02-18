import { Module } from '@nestjs/common';
import { XlsxReaderService } from './service/xlsx-reader.service';
import { XlsxReaderController } from './controller/xlsx-reader.controller';
import { BatcProcessorService } from './service/batch-processor.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [XlsxReaderController],
  providers: [XlsxReaderService, BatcProcessorService],
  imports: [
    ClientsModule.register([
      {
        name: 'DELIVERY_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis_for_microservices',
          port: 6379,
        },
      },
    ]),
  ],
})
export class XlsxReaderModule {}
