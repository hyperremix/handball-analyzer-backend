import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { LoggerFormat } from 'logger';
import { ConfigService } from './config.service';
import { TEnvironmentVariables } from './TEnvironmentVariables';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      ignoreEnvFile: true,
      validationSchema: Joi.object<TEnvironmentVariables, true>({
        AWS_LAMBDA_FUNCTION_NAME: Joi.string().required(),
        AWS_LAMBDA_FUNCTION_VERSION: Joi.string().required(),
        AWS_LAMBDA_TIMEOUT_SECONDS: Joi.number().default(30),
        AWS_REGION: Joi.string().default('eu-central-1'),
        DYNAMODB_ENDPOINT: Joi.string().required(),
        DYNAMODB_USE_LOCAL: Joi.boolean().default(false),
        TEAMS_TABLE: Joi.string().required(),
        GAMES_TABLE: Joi.string().required(),
        GAME_EVENTS_TABLE: Joi.string().required(),
        LEAGUES_TABLE: Joi.string().required(),
        PDF_TABLE: Joi.string().required(),
        LEAGUE_ID_INDEX: Joi.string().required(),
        GAME_ID_INDEX: Joi.string().required(),
        LOGGER_FORMAT: Joi.string()
          .valid(...Object.values(LoggerFormat))
          .default(LoggerFormat.string),
        AWS_S3_PDF_BUCKET: Joi.string().required(),
      }),
    }),
  ],
  providers: [
    ConfigService,
    {
      provide: 'AWS_REGION',
      useFactory: (config: ConfigService) => config.aws.region,
      inject: [ConfigService],
    },
    {
      provide: 'DYNAMODB_USE_LOCAL',
      useFactory: (config: ConfigService) => config.db.useLocal,
      inject: [ConfigService],
    },
    {
      provide: 'DYNAMODB_ENDPOINT',
      useFactory: (config: ConfigService) => config.db.endpoint,
      inject: [ConfigService],
    },
    {
      provide: 'LOGGER_FORMAT',
      useFactory: (config: ConfigService) => config.logger.format,
      inject: [ConfigService],
    },
  ],
  exports: [
    ConfigService,
    'AWS_REGION',
    'DYNAMODB_USE_LOCAL',
    'DYNAMODB_ENDPOINT',
    'LOGGER_FORMAT',
  ],
})
export class ConfigModule {}
