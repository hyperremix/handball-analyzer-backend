import { LoggerFormat } from 'logger';

export type TEnvironmentVariables = {
  AWS_REGION: string;
  AWS_LAMBDA_FUNCTION_NAME: string;
  AWS_LAMBDA_FUNCTION_VERSION: string;
  AWS_LAMBDA_TIMEOUT_SECONDS: number;
  DYNAMODB_ENDPOINT: string;
  DYNAMODB_USE_LOCAL: boolean;
  TEAMS_TABLE: string;
  PLAYERS_TABLE: string;
  GAMES_TABLE: string;
  GAME_EVENTS_TABLE: string;
  LOGGER_FORMAT: LoggerFormat;
};
