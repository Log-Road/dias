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
import { COMPETITION_STATUS, PrismaClient } from "./client";

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

  async saveCompetition(competition: {
    name: string;
    startDate: string;
    endDate: string;
    purpose: string;
    audience: string;
    place: string;
  }) {
    const { name, startDate, endDate, purpose, audience, place } = competition;

    try {
      return await this.contests.create({
        data: {
          name,
          start_date: startDate,
          end_date: endDate,
          purpose,
          audience,
          place,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async saveAwards(awards: { contestId: string; count: number; name: string }) {
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

  async saveWinner(
    contestId: string,
    winner: { awardId: string; userId: string },
  ) {
    try {
      const { awardId, userId } = winner;
      return await this.winner.create({
        data: {
          contest_id: contestId,
          award_id: awardId,
          user_id: userId,
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
      const result = await this.club.findFirst({
        where: {
          club_name: clubName,
        },
      });

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findCompetitionById(competitionId: string) {
    try {
      return await this.contests.findUnique({
        where: {
          id: competitionId,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findCompetitionList(page: number) {
    try {
      const result = await this.contests.findMany({
        // page >= 0
        skip: page * 15,
        take: 15,
        select: {
          id: true,
          name: true,
          status: true,
          start_date: true,
          end_date: true,
        },
      });
      return result;
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

  async patchCompetition(
    id: string,
    obj: {
      name?: string;
      status?: COMPETITION_STATUS;
      startDate?: string;
      endDate?: string;
      purpose?: string;
      audience?: string;
      place?: string;
    },
  ) {
    try {
      await this.$transaction(async (prisma) => {
        const thisComp = await this.contests.findUnique({
          where: {
            id,
          },
        });

        await this.contests.update({
          where: {
            id,
          },
          data: {
            name: obj.name ?? thisComp.name,
            status: obj.status ?? thisComp.status,
            start_date: new Date(obj.startDate ?? thisComp.start_date),
            end_date: new Date(obj.endDate ?? thisComp.end_date),
            purpose: obj.purpose ?? thisComp.purpose,
            audience: obj.audience ?? thisComp.audience,
            place: obj.place ?? thisComp.place,
          },
        });
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
