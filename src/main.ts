import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  ValidationError,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import ValidationExceptions from "./exceptions/validations.exceptions";
import { ConfigService } from "@nestjs/config";
import { NotFoundExceptionFilter } from "./exceptions/notfound.exceptions";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = ["http://localhost:3002"];

  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization,x-auth-token,X-Auth-Token",
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationExceptions(errors),
    })
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://accounts.google.com"],
      },
    })
  );

  const options = new DocumentBuilder()
    .setTitle("Medpass backend ")
    .setDescription("API  documentation medpass ")
    .setVersion("1.0.0")
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/docs", app, document);

  await app.listen(port);
}
bootstrap();
