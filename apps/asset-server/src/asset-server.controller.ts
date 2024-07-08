import { Controller, Get } from '@nestjs/common';
import { AssetServerService } from './asset-server.service';

@Controller()
export class AssetServerController {
  constructor(private readonly assetServerService: AssetServerService) {}

  @Get()
  getHello(): string {
    return this.assetServerService.getHello();
  }
}
