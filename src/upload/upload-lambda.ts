import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UploadController } from './upload.controller';
import { UploadModule } from './upload.module';

let app: INestApplicationContext | undefined;

export const handler = async () => {
  if (!app) {
    app = await NestFactory.createApplicationContext(UploadModule, {
      bufferLogs: true,
    });
  }

  const controller = app.get(UploadController);

  await controller.handleCronEvent();
};
