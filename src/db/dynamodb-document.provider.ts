import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from 'config';

export const DynamoDBDocumentProvider: FactoryProvider = {
  provide: DynamoDBDocument,
  useFactory: (configService: ConfigService): DynamoDBDocument =>
    DynamoDBDocument.from(
      new DynamoDB(
        configService.db.useLocal
          ? {
              region: 'localhost',
              endpoint: configService.db.endpoint,
            }
          : {
              region: configService.aws.region,
            },
      ),
      {
        marshallOptions: {
          convertClassInstanceToMap: true,
          removeUndefinedValues: true,
        },
      },
    ),
  inject: [ConfigService],
};
