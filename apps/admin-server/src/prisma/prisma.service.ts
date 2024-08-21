import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "./client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    readonly configService: ConfigService,
    @Inject(Logger) private logger: Logger,
  ) {
    super({
      datasources: {
        db: {
          url: configService.get("POSTGRESQL_DB"),
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async saveClub(clubName: string, isActive?: boolean) {
    try {
      return await this.club.create({
        data: {
          club_name: clubName,
          is_active: isActive,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async saveCompetition(competition) {
    const { name, startDate, endDate, purpose, audience, place } = competition;

    try {
      return await this.contests.create({
        data: {
          name,
          start_date: startDate,
          end_date: endDate,
          purpose,
          audience,
          place
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async saveAwards(awards) {
    const { contestId, count, name } = awards;
    try {
      return await this.awards.create({
        data: {
          contest_id: contestId,
          count,
          name,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findClubs() {
    try {
      return await this.club.findMany();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findClub(clubId: string) {
    try {
      const thisClub = await this.club.findUnique({
        where: {
          club_id: clubId,
        },
      });
      if (!thisClub) throw new NotFoundException();
      return thisClub;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findClubByName(clubName: string) {
    try {
      return await this.club.findFirst({
        where: {
          club_name: clubName,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async patchClubStatus(clubId: string) {
    try {
      const thisClub = await this.findClub(clubId);
      if (!thisClub) throw new NotFoundException();
      return await this.club.update({
        where: {
          club_id: clubId,
        },
        data: {
          is_active: !thisClub.is_active,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async deleteClub(clubId: string) {
    try {
      const thisClub = await this.findClub(clubId);
      if (!thisClub) throw new NotFoundException();
      return await this.club.delete({
        where: {
          club_id: clubId,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}
