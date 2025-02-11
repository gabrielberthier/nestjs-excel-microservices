import { Module } from '@nestjs/common';
import { NestCoreModule } from './nest-multer-core.module';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './nest-multer.module-definition';
import { MULTER_OPTIONS } from './files.constants';
import { MulterModuleOptions } from './interfaces';

@Module({
  imports: [NestCoreModule],
  controllers: [],
  providers: [
    {
      provide: MULTER_OPTIONS,
      useFactory: (options?: MulterModuleOptions) => ({ ...(options ?? {}) }),
      inject: [{ token: MODULE_OPTIONS_TOKEN, optional: true }],
    },
  ],
  exports: [MULTER_OPTIONS, NestCoreModule],
})
export class NestMulterModule extends ConfigurableModuleClass {}
