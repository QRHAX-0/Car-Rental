import { Test, TestingModule } from '@nestjs/testing';
import { AgencyAdminController } from './agency-admin.controller';

describe('AgencyAdminController', () => {
  let controller: AgencyAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyAdminController],
    }).compile();

    controller = module.get<AgencyAdminController>(AgencyAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
