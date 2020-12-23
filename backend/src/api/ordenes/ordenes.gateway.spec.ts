import { Test, TestingModule } from '@nestjs/testing';
import { OrdenesGateway } from './ordenes.gateway';

describe('OrdenesGateway', () => {
  let gateway: OrdenesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenesGateway],
    }).compile();

    gateway = module.get<OrdenesGateway>(OrdenesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
