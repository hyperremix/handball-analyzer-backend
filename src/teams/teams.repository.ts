import { Team } from '@model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';

@Injectable()
export class TeamsRepository extends BaseRepository<Team> {
  constructor(dynamoDBClient: DynamoDBClient, private configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.teams);
  }

  async findManyByLeagueId(leagueId: string): Promise<Team[]> {
    return await super.query({ leagueId }, this.configService.db.indices.leagueId);
  }
}
