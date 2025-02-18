import {
  FileInterceptor,
  FilesInterceptor,
  MulterFile,
} from '@app/nest-multer';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { File } from 'buffer';

@ApiTags('Files')
@Controller('file-uploader')
export class FileUploaderController {
  constructor() {}

  @Post('/file')
  @ApiOperation({ summary: 'Uploads a single file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  singleFile(@UploadedFile() file: MulterFile) {
    console.log(file);
    console.log(file.constructor.name);
    console.log(file.buffer.toString());

    return { success: true };
  }

  @Post('/files')
  @ApiOperation({ summary: 'Uploads multiple files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 4))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  multipleFiles(@UploadedFiles() files: Array<File>) {
    return console.log(files);
  }

  @Get('/')
  @ApiOperation({ summary: 'Uploads multiple files' })
  @ApiConsumes('multipart/form-data')
  healthCheck() {
    console.log('World');

    return { success: true };
  }
}
