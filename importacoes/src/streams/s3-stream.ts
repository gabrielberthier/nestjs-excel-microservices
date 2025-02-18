import Stream from 'stream';
import { GetObjectCommandOutput, S3 } from '@aws-sdk/client-s3';

type S3DownloadStreamOptions = {
  readonly s3: S3;
  readonly bucket: string;
  readonly key: string;
  readonly rangeSize?: number;
};

const DEFAULT_DOWNLOAD_CHUNK_SIZE = 512 * 1024;

export class S3DownloadStream extends Stream.Transform {
  private _currentCursorPosition = 0;
  private maxContentLength = -1;
  private isInitiated: boolean = false;

  constructor(
    private readonly options: S3DownloadStreamOptions,
    nodeReadableStreamOptions?: Stream.ReadableOptions,
  ) {
    super(nodeReadableStreamOptions);
    this.options = options;
  }

  public async init() {
    const { bucket, key, s3, rangeSize } = this.options;
    const res = await s3.headObject({
      Bucket: bucket,
      Key: key,
      ...(rangeSize && { Range: String(rangeSize) }),
    });
    this.maxContentLength = res.ContentLength ?? -1;
    await this.fetchAndEmitNextRange();
  }

  async fetchAndEmitNextRange() {
    if (!this.isInitiated) {
      await this.init();
      this.isInitiated = true;
    }
    if (this._currentCursorPosition > this.maxContentLength) {
      this.end();
      return;
    }

    // Calculate the range of bytes we want to grab
    const range =
      this._currentCursorPosition +
      (this.options.rangeSize ?? DEFAULT_DOWNLOAD_CHUNK_SIZE);

    // If the range is greater than the total number of bytes in the file
    // We adjust the range to grab the remaining bytes of data
    const adjustedRange =
      range < this.maxContentLength ? range : this.maxContentLength;

    // Set the Range property on our s3 stream parameters
    const rangeParam = `bytes=${this._currentCursorPosition}-${adjustedRange}`;

    // Update the current range beginning for the next go
    this._currentCursorPosition = adjustedRange + 1;

    // Grab the range of bytes from the file
    this.options.s3.getObject(
      { Bucket: this.options.bucket, Key: this.options.key, Range: rangeParam },
      (error?: Error, res?: GetObjectCommandOutput) => {
        if (error) {
          // If we encounter an error grabbing the bytes
          // We destroy the stream, NodeJS ReadableStream will emit the 'error' event
          this.destroy(error);
          return;
        }

        console.log(
          `fetched range ${this.options.bucket}/${this.options.key} | ${rangeParam}`,
        );

        const data = res?.Body;

        if (!(data instanceof Stream.Readable)) {
          // never encountered this error, but you never know
          const strError = 'null value';
          this.destroy(
            new Error(`unsupported data representation: ${strError}`),
          );
          return;
        }

        data.pipe(this, { end: false });

        let streamClosed = false;

        data.on('end', () => {
          if (streamClosed) {
            return;
          }
          streamClosed = true;
          this.fetchAndEmitNextRange().catch(console.error);
        });
      },
    );
  }
}
