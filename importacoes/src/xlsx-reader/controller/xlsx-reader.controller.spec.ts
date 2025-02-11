import { Test, TestingModule } from '@nestjs/testing';
import { XlsxReaderController } from './xlsx-reader.controller';

describe('XlsxReaderController', () => {
  let controller: XlsxReaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XlsxReaderController],
    }).compile();

    controller = module.get<XlsxReaderController>(XlsxReaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
