import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { S3Handler } from 'aws-lambda';
import { PdfController } from './pdf.controller';
import { PdfModule } from './pdf.module';

let app: INestApplicationContext | undefined;

export const handler: S3Handler = async (event) => {
  if (!app) {
    app = await NestFactory.createApplicationContext(PdfModule, {
      bufferLogs: true,
    });
  }

  const controller = app.get(PdfController);

  const s3 = event.Records[0].s3;
  const key = s3.object.key;
  const bucket = s3.bucket.name;

  await controller.handleS3CreationEvent(bucket, key);
};
