import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, Logger],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('sum', () => {
    expect(1 + 2).toBe(3)
  })
});
