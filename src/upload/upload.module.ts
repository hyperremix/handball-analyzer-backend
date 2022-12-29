import { Module } from '@nestjs/common';
import { ConfigModule } from 'config';
import { DbModule } from 'db';
import { LoggerModule } from 'logger';
import { S3Module } from 's3/s3.module';
import { UploadController } from './upload.controller';
import { UploadRepository } from './upload.repository';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule, LoggerModule, DbModule, S3Module],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
