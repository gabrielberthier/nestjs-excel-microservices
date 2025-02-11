import { Test, TestingModule } from '@nestjs/testing';
import { NestMulterService } from './nest-multer.service';

describe('NestMulterService', () => {
  let service: NestMulterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestMulterService],
    }).compile();

    service = module.get<NestMulterService>(NestMulterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
