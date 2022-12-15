import { Injectable } from '@nestjs/common';
import { AWSError, S3 } from 'aws-sdk';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3) {}

  async getObject(bucket: string, key: string): Promise<PromiseResult<GetObjectOutput, AWSError>> {
    try {
      return await this.s3.getObject({ Bucket: bucket, Key: key }).promise();
    } catch (error) {
      throw new Error(`Error getting object ${bucket}/${key}: ${error}`);
    }
  }
}
