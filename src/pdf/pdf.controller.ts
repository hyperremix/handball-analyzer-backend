import { Body, Controller, Put } from '@nestjs/common';
import { LoggerService } from 'logger';
import PdfParse from 'pdf-parse';
import { S3Service } from 's3/s3.service';

@Controller('pdf')
export class PdfController {
  constructor(private logger: LoggerService, private s3Service: S3Service) {
    this.logger.setContext(this.constructor.name);
  }

  @Put('replay')
  async replay(@Body() { bucket, key }: { bucket: string; key: string }): Promise<string> {
    this.logger.info(`Handling file ${bucket}/${key} that was uploaded to S3`);
    const s3Object = await this.s3Service.getObject(bucket, key);

    const pdfBuffer = s3Object.Body as Buffer;
    if (!pdfBuffer) {
      throw new Error(`No body found for ${bucket}/${key}`);
    }

    return await this.parsePdf(pdfBuffer);
  }

  async handleS3CreationEvent(bucket: string, key: string): Promise<string> {
    this.logger.info(`Handling file ${bucket}/${key} that was uploaded to S3`);
    const s3Object = await this.s3Service.getObject(bucket, key);

    const pdfBuffer = s3Object.Body as Buffer;
    if (!pdfBuffer) {
      throw new Error(`No body found for ${bucket}/${key}`);
    }

    return await this.parsePdf(pdfBuffer);
  }

  private async parsePdf(pdfBuffer: Buffer): Promise<string> {
    const pdf = await PdfParse(pdfBuffer);
    console.log(pdf.text);
    return pdf.text;
  }
}
