import { Module } from '@nestjs/common';
import { AssetServerController } from './asset-server.controller';
import { AssetServerService } from './asset-server.service';

@Module({
  imports: [],
  controllers: [AssetServerController],
  providers: [AssetServerService],
})
export class AssetServerModule {}
