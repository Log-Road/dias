import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';

@Module({
  controllers: [CompetitionController],
  providers: [CompetitionService]
})
export class CompetitionModule {}
