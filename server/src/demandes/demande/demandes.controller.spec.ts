import { Test, TestingModule } from '@nestjs/testing';
import { DemandesController } from './demande.controller';

describe('DemandesController', () => {
  let controller: DemandesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandesController],
    }).compile();

    controller = module.get<DemandesController>(DemandesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
