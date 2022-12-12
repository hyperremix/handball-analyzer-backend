import { FactoryProvider } from '@nestjs/common';
import { S3 } from 'aws-sdk';

export const S3Provider: FactoryProvider<S3> = {
  provide: S3,
  useFactory: (): S3 => {
    return new S3({ signatureVersion: 'v4' });
  },
};
