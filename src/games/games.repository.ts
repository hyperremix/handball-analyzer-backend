import { Game } from '@model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';

@Injectable()
export class GamesRepository extends BaseRepository<Game> {
  constructor(dynamoDBClient: DynamoDBClient, private configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.games);
  }

  async findManyByLeagueId(leagueId: string): Promise<Game[]> {
    return await super.query({ leagueId }, this.configService.db.indices.leagueId);
  }
}
