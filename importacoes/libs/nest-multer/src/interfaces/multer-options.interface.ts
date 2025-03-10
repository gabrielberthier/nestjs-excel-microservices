import { Options } from 'fastify-multer/lib/interfaces';

/**
 * @see https://github.com/expressjs/multer
 */
export type MulterOptions = Options;

export interface MulterField {
  /** The field name. */
  name: string;
  /** Optional maximum number of files per field to accept. */
  maxCount?: number;
}
