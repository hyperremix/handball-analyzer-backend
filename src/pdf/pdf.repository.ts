import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config';
import { BaseRepository, DynamoDBClient } from 'db';
import { Pdf } from './Pdf';

@Injectable()
export class PdfRepository extends BaseRepository<Pdf> {
  constructor(dynamoDBClient: DynamoDBClient, configService: ConfigService) {
    super(dynamoDBClient, configService.db.tables.pdf);
  }
}
