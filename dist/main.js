"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const validations_exceptions_1 = require("./exceptions/validations.exceptions");
const config_1 = require("@nestjs/config");
const notfound_exceptions_1 = require("./exceptions/notfound.exceptions");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        'http://localhost:3002',
        'https://useglouse.com',
        'https://admin.useglouse.com',
    ];
    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization,x-auth-token,X-Auth-Token',
        credentials: true,
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    app.useGlobalPipes(new common_1.ValidationPipe({
        exceptionFactory: (errors) => new validations_exceptions_1.default(errors),
    }));
    app.useGlobalFilters(new notfound_exceptions_1.NotFoundExceptionFilter());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.use(helmet_1.default.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", 'https://accounts.google.com'],
        },
    }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Glouse backend ')
        .setDescription('API  documentation for glouse app')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('/docs', app, document);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map