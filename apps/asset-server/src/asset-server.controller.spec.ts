import { Test, TestingModule } from '@nestjs/testing';
import { AssetServerController } from './asset-server.controller';
import { AssetServerService } from './asset-server.service';

describe('AssetServerController', () => {
  let assetServerController: AssetServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetServerController],
      providers: [AssetServerService],
    }).compile();

    assetServerController = app.get<AssetServerController>(AssetServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(assetServerController.getHello()).toBe('Hello World!');
    });
  });
});
