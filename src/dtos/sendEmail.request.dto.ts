export class SendEmailRequestDto {
  email: string;
  title: string;
  content: string;
}

export enum EmailType {
  AUTH,
  NOTICE,
}

export const emailTitle = (type: EmailType, title?: string) => {
  if (type === EmailType.AUTH) {
    return "[ROAD] 인증 메일입니다.";
  }
  return `[ROAD] ${title}`;
};

export const emailContent = (type: EmailType, content?: string) => {
  if (type === EmailType.AUTH) {
    return ""; // html code
  }
  return content;
};
