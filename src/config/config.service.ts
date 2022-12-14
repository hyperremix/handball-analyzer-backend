/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TEnvironmentVariables } from './TEnvironmentVariables';

@Injectable()
export class ConfigService {
  constructor(private config: NestConfigService<TEnvironmentVariables>) {}

  get aws() {
    return {
      lambda: {
        name: this.get('AWS_LAMBDA_FUNCTION_NAME'),
        version: this.get('AWS_LAMBDA_FUNCTION_VERSION'),
        timeoutSeconds: this.get('AWS_LAMBDA_TIMEOUT_SECONDS'),
      },
      region: this.get('AWS_REGION'),
      s3: {
        buckets: {
          pdf: this.get('AWS_S3_PDF_BUCKET'),
        },
      },
    };
  }

  get db() {
    return {
      endpoint: this.get('DYNAMODB_ENDPOINT'),
      useLocal: this.get('DYNAMODB_USE_LOCAL'),
      tables: {
        teams: this.get('TEAMS_TABLE'),
        games: this.get('GAMES_TABLE'),
        gameEvents: this.get('GAME_EVENTS_TABLE'),
        leagues: this.get('LEAGUES_TABLE'),
        pdf: this.get('PDF_TABLE'),
      },
      indices: {
        leagueId: this.get('LEAGUE_ID_INDEX'),
        gameId: this.get('GAME_ID_INDEX'),
      },
    };
  }

  get logger() {
    return {
      format: this.get('LOGGER_FORMAT'),
    };
  }

  private get<TKey extends keyof TEnvironmentVariables>(key: TKey) {
    return this.config.get(key, {
      infer: true,
    })!;
  }
}
