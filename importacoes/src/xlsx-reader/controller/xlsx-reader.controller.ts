import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { XlsxReaderService } from '../service/xlsx-reader.service';
import { BatcProcessorService } from '../service/batch-processor.service';
import { ClientProxy } from '@nestjs/microservices';
import { ContentTypeValidationGuard } from '../../content-type-validation/content-type-validation.guard';

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
  @UseGuards(new ContentTypeValidationGuard())
  public async upload(
    @Request() request: { files: () => AsyncGenerator<MultipartFile> },
  ) {
    try {
      const multiPart: AsyncGenerator<MultipartFile> = request.files();

      for await (const part of multiPart) {
        for await (const event of this.readerService.readFile(part.file)) {
          this.client.emit(event.name, event);
        }
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
