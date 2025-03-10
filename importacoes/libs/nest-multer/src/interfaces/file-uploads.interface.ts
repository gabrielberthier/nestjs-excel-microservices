import { Type } from '@nestjs/common';
import { ModuleMetadata, Provider } from '@nestjs/common/interfaces';
import { MulterOptions } from './multer-options.interface';

export type MulterModuleOptions = MulterOptions;

export interface MulterOptionsFactory {
  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface MulterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MulterOptionsFactory>;
  useClass?: Type<MulterOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<MulterModuleOptions> | MulterModuleOptions;
  inject?: Provider[];
}
