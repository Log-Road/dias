import { NestFactory } from '@nestjs/core';
import { AssetServerModule } from './asset-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AssetServerModule);
  await app.listen(3000);
}
bootstrap();
