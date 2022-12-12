import { Callback, Context, Handler } from 'aws-lambda';
import { createModuleHandler } from 'handler.factory';
import 'source-map-support/register';
import { AppModule } from './app.module';

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = await createModuleHandler(AppModule);
  return server(event, context, callback);
};
