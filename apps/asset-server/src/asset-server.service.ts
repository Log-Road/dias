import { Injectable } from "@nestjs/common";

@Injectable()
export class AssetServerService {
  getHello(body): string {
    return body;
  }
}
