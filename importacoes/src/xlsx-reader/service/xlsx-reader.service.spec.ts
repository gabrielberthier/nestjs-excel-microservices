import { Test, TestingModule } from '@nestjs/testing';
import { XlsxReaderService } from './xlsx-reader.service';

describe('XlsxReaderService', () => {
  let service: XlsxReaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XlsxReaderService],
    }).compile();

    service = module.get<XlsxReaderService>(XlsxReaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
