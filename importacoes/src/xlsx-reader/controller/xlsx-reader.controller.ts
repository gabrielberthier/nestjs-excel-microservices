import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { XlsxReaderService } from '../service/xlsx-reader.service';
import { BatcProcessorService } from '../service/batch-processor.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('xlsx-reader')
export class XlsxReaderController {
  constructor(
    @Inject()
    private readonly readerService: XlsxReaderService,
    @Inject()
    private readonly batchProcessor: BatcProcessorService,
    @Inject('DELIVERY_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('/upload')
  public async upload(
    @Request() request: { files: () => AsyncGenerator<MultipartFile> },
  ) {
    try {
      const multiPart: AsyncGenerator<MultipartFile> = request.files();

      for await (const part of multiPart) {
        for await (const event of this.readerService.readFile(part.file)) {
          this.client.emit(event.name, event);
        }
        await this.batchProcessor.cleanUp();
      }

      return { message: 'files uploaded' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error uploading files. ${error}`);
    }
  }
}
