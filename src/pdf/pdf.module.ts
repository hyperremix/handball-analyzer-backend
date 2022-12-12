import { Module } from '@nestjs/common';
import { S3Module } from 's3/s3.module';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [S3Module],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
