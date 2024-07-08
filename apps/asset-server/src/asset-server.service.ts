import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
