import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDataService } from './update-data.service';

describe('UpdateDataService', () => {
  let service: UpdateDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateDataService],
    }).compile();

    service = module.get<UpdateDataService>(UpdateDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
