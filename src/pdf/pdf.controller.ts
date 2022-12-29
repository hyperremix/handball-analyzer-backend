import { Body, Controller, Put } from '@nestjs/common';
import { LoggerService } from 'logger';
import { S3Service } from 's3/s3.service';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private logger: LoggerService,
    private s3Service: S3Service,
    private pdfService: PdfService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Put('replay')
  async replay(@Body() { bucket, key }: { bucket: string; key: string }): Promise<void> {
    this.logger.info(`Replaying file ${bucket}/${key}`);
    const s3Object = await this.s3Service.getObject(bucket, key);

    const pdfBuffer = s3Object.Body as Buffer;
    if (!pdfBuffer) {
      throw new Error(`No body found for ${bucket}/${key}`);
    }

    await this.pdfService.parsePdf(pdfBuffer);
  }

  async handleS3CreationEvent(bucket: string, key: string): Promise<void> {
    const pdfExists = await this.pdfService.pdfAlreadyParsed(key);
    if (pdfExists) {
      this.logger.info(`Skipping file ${bucket}/${key}. It has already been parsed`);
      return;
    }

    this.logger.info(`Handling file ${bucket}/${key} that was uploaded to S3`);
    const s3Object = await this.s3Service.getObject(bucket, key);

    const pdfBuffer = s3Object.Body as Buffer;
    if (!pdfBuffer) {
      throw new Error(`No body found for ${bucket}/${key}`);
    }

    await this.pdfService.parsePdf(pdfBuffer);
  }
}
