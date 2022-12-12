import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';
import { GameEvent } from 'models';

@Injectable()
export class GameEventsRepository extends BaseRepository<GameEvent> {
  constructor(dynamoDBClient: DynamoDBClient, configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.gameEvents);
  }
}
