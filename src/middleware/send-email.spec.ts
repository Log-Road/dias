import { Test, TestingModule } from "@nestjs/testing";
import SendEmail from "./send-email";

describe("SendEmail", () => {
  let provider: SendEmail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendEmail],
    }).compile();

    provider = module.get<SendEmail>(SendEmail);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
