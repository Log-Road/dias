export class SendEmailResponseDto {
  requestId: string;
  extendedRequestId?: string;
  cfId?: string;
  attempts: number;
  totalRetryDelay: number;
}
