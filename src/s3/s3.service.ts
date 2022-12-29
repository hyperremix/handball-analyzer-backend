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

  async upload(bucket: string, contentType: string, key: string, body: S3.Body): Promise<void> {
    try {
      await this.s3
        .upload({
          Bucket: bucket,
          Key: key,
          ContentType: contentType,
          ACL: 'public-read',
          Body: body,
        })
        .promise();
    } catch (error) {
      throw new Error(`Error uploading object ${bucket}/${key}: ${error}`);
    }
  }
}
