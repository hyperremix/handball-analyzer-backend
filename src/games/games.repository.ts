import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';
import { Game } from 'models';

@Injectable()
export class GamesRepository extends BaseRepository<Game> {
  constructor(dynamoDBClient: DynamoDBClient, configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.games);
  }
}
