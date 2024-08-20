import { Test, TestingModule } from "@nestjs/testing";
import { PersonController } from "../person.controller";
import { PersonService } from "../person.service";

describe("PersonController", () => {
  let controller: PersonController;

  const serviceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  describe("getPerson", () => {});

  describe("searchPerson", () => {});

  describe("individualPatchPerson", () => {});

  describe("patchPersonByDocument", () => {});

  describe("postPersonByDocument", () => {});
});
