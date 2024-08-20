import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { MulterConfigService } from './config/multerConfig.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    })
  ],
  providers: [PersonService],
  controllers: [PersonController]
})
export class PersonModule {}
