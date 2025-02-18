import { Test, TestingModule } from '@nestjs/testing';
import { XlsxReaderController } from './xlsx-reader.controller';
import { XlsxReaderService } from '../service/xlsx-reader.service';
import { BatcProcessorService } from '../service/batch-processor.service';

describe('XlsxReaderController', () => {
  let controller: XlsxReaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XlsxReaderController],
      providers: [
        XlsxReaderService,
        BatcProcessorService,
        {
          provide: 'DELIVERY_SERVICE',
          useValue: jest.mock,
        },
      ],
    }).compile();

    controller = module.get<XlsxReaderController>(XlsxReaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
