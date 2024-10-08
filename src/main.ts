import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CorsOptions } from "./utils/corsOption.util";
import { Transport } from "@nestjs/microservices";
import { HttpExceptionFilter } from "./http.exception/http.exception.filter";
import { Logger, ValidationPipe } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { WinstonInstance } from "./utils/winston.util";
import { configDotenv } from "dotenv";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  configDotenv({
    path: "../.env"
  });

  const app = await NestFactory.create(AppModule, {
    cors: CorsOptions,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
  });

  await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
    options: {
      package: "dias",
      url: `localhost:${ process.env.PORT }`,
      protoPath: "src/proto/dias.proto",
      logger: WinstonModule.createLogger({
        instance: WinstonInstance,
      }),
    },
  });

  const docs = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("DIAS")
      .setVersion("1.0.0")
      .setDescription("DIAS - DSM Integrated Account Solution")
      .addBearerAuth({
        type: "http",
        in: "header",
        scheme: "Bearer",
        name: "authorization",
      })
      .build(),
  );

  SwaggerModule.setup("docs", app, docs);

  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: true,
    }),
  );

  await app.startAllMicroservices()

  app.listen(Number(process.env.PORT ?? "8000"), () => {
    const logger = WinstonModule.createLogger({ instance: WinstonInstance });
    logger.log(`DIAS RUNNING ON PORT ${process.env.PORT ?? 8000}`);
    logger.log(`                                `);
    logger.log(`                                `);
    logger.log(`               ::               `);
    logger.log(`              +++=              `);
    logger.log(`              .-:               `);
    logger.log(`            =++++=-.            `);
    logger.log(`           -+++:-+++.           `);
    logger.log(`          :+++. .+++:         DIAS For ROAD  `);
    logger.log(
      `         .+++++++++=           - DSM Integrated Account Solution   `,
    );
    logger.log(`         ++++=++++++=.          `);
    logger.log(`        -+++     :=+++-         `);
    logger.log(`       :+++:       :+++=        `);
    logger.log(`       ++++.        =+++=.      `);
    logger.log(`       .::::         ::::.      `);
    logger.log(`                                `);
    logger.log(`                                `);
  });
}
bootstrap();
