import { IsArray, IsObject } from "class-validator";
import { NowAndArchiveItemDto } from "./nowAndArchiveItem.dto";
import { RecentlyItemDto } from "./recentlyItem.dto";
import { ProjectItemDto } from "./projectItem.dto";

export class MainpageRespondDto {
  @IsArray()
  now: NowAndArchiveItemDto[];

  @IsObject()
  recently: RecentlyItemDto;

  @IsArray()
  archive: NowAndArchiveItemDto[];

  @IsArray()
  project: ProjectItemDto[];
}
