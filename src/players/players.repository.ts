import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';
import { Player } from 'models';

@Injectable()
export class PlayersRepository extends BaseRepository<Player> {
  constructor(dynamoDBClient: DynamoDBClient, configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.players);
  }
}
