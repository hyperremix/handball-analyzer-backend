import { Global, Module } from '@nestjs/common';
import { DynamoDBDocumentProvider } from './dynamodb-document.provider';
import { DynamoDBClient } from './dynamodb.client';

@Global()
@Module({
  providers: [DynamoDBDocumentProvider, DynamoDBClient],
  exports: [DynamoDBClient],
})
export class DbModule {}
