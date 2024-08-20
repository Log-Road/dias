import { Injectable } from "@nestjs/common";
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from "@nestjs/platform-express";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor (
    private configService: ConfigService,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multerS3({
        s3: new S3Client({
          region: this.configService.get<string>('AWS_S3_REGION'),
          credentials: {
            accessKeyId: this.configService.get<string>(''),
            secretAccessKey: this.configService.get<string>(''),
          }
        }),
        bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
    };
  }
}
