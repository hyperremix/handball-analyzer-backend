import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';
import compression from 'compression';
import express from 'express';

let cachedServer: Handler;

export const createModuleHandler = async <T>(module: { new (): T }): Promise<Handler> => {
  if (!cachedServer) {
    cachedServer = await createServerlessExpress(module);
  }

  return cachedServer;
};

const createServerlessExpress = async <T>(module: { new (): T }): Promise<Handler> => {
  const expressApp = express();
  const nestApp = await NestFactory.create(module, new ExpressAdapter(expressApp), {
    bufferLogs: true,
  });

  // nestApp.useLogger(await nestApp.resolve(LoggerService));
  nestApp.enableCors();
  nestApp.use(compression());
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { value: true },
      exceptionFactory: (errors) => {
        const err = errors.map((e) => {
          return `property: ${e.property} | value: '${e.value}'`;
        });

        return new UnprocessableEntityException(err.join(', '));
      },
    }),
  );

  await nestApp.init();

  return serverlessExpress({ app: expressApp });
};
