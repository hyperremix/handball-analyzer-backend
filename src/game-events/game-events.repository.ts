import { GameEvent } from '@model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';

@Injectable()
export class GameEventsRepository extends BaseRepository<GameEvent> {
  constructor(dynamoDBClient: DynamoDBClient, private configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.gameEvents);
  }

  async findManyByLeagueId(leagueId: string): Promise<GameEvent[]> {
    return await super.query({ leagueId }, this.configService.db.indices.leagueId);
  }
}
