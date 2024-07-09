import { Body, Controller, Get } from '@nestjs/common';
import { AssetServerService } from './asset-server.service';
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../dias/src/auth/strategies/jwt/jwt.auth.guard'
import { ROLE } from 'apps/dias/src/utils/type.util';
import { Role } from 'apps/dias/src/guard/role/role.decorator';
import { RoleGuard } from 'apps/dias/src/guard/role/role.guard';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller()
export class AssetServerController {
  constructor(private readonly assetServerService: AssetServerService) {}

  @Get()
  @Role(ROLE.Admin)
  getHello(@Body() body): string {
    return this.assetServerService.getHello(body);
  }
}
