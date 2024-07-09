import { Test, TestingModule } from '@nestjs/testing';
import { AssetServerController } from './asset-server.controller';
import { AssetServerService } from './asset-server.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../dias/src/prisma/prisma.service';

describe('AssetServerController', () => {
  let assetServerController: AssetServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetServerController],
      providers: [AssetServerService, JwtService, PrismaService, ConfigService],
    }).compile();

    assetServerController = app.get<AssetServerController>(AssetServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const request = {
        user: {
          "id": "53945869-f07c-40c1-b2fe-9f4aef9a8539",
          "userId": "iixanx",
          "name": "awdfd",
          "email": "ioixa@gmail.com",
          "role": "Admin",
          "number": null,
          "provided": "local"
        }
      }

      expect(assetServerController.getHello(request)).toBe(request);
    });
  });
});
