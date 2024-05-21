import { SendEmailCommandInput, SendEmailCommandOutput } from "@aws-sdk/client-ses";
import { Res } from "../../../dtos/response.dto";

export class SendEmailWithLoginRes implements Res<SendEmailCommandOutput> {
  data: SendEmailCommandOutput;
  statusCode: number;
  statusMsg: string;
}

export class ParamEmail implements SendEmailCommandInput {
  constructor(
    toEmail: string[],
    ccEmail?: string[],
  ){
    this.Source = process.env.LOG_EMAIL
    this.Destination.ToAddresses = toEmail
    this.Destination.CcAddresses = ccEmail
  }

  Source: string
  Destination: {
    CcAddresses: string[],
    ToAddresses: string[],
  }
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: ""
      }
    },
    Subject: {
      Charset: "UTF-8",
      Data: ""
    }
  }
  ReplyToAddresses: []
}