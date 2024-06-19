import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Inject, Injectable } from "@nestjs/common";
import {
  SendEmailRequestDto,
} from "src/dtos/sendEmail.request.dto";
import { SendEmailResponseDto } from "src/dtos/sendEmail.response.dto";

@Injectable()
export default class SendEmail {
  constructor(@Inject(SESClient) private ses: SESClient) {
    this.ses = new SESClient({
      region: "ap-northeast-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  command = (request: SendEmailRequestDto) =>
    new SendEmailCommand({
      Destination: {
        ToAddresses: [request.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: request.content,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: request.title,
        },
      },
      Source: process.env.LOG_EMAIL,
      ReplyToAddresses: [],
    });

  send = async (
    request: SendEmailRequestDto,
  ): Promise<SendEmailResponseDto> => {
    const response = await this.ses.send(
      this.command({
        email: request.email,
        title: request.title,
        content: request.content,
      }),
    );
    const { requestId, attempts, totalRetryDelay } = response.$metadata;

    return {
      requestId,
      attempts,
      totalRetryDelay,
    };
  };
}
