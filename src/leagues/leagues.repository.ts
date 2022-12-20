import { League } from '@model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';

@Injectable()
export class LeaguesRepository extends BaseRepository<League> {
  constructor(dynamoDBClient: DynamoDBClient, configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.leagues);
  }
}
