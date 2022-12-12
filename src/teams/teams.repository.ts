import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';
import { Team } from 'models';

@Injectable()
export class TeamsRepository extends BaseRepository<Team> {
  constructor(dynamoDBClient: DynamoDBClient, configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.teams);
  }
}
