import { Controller, Put } from '@nestjs/common';
import { LoggerService } from 'logger';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private logger: LoggerService, private uploadService: UploadService) {
    this.logger.setContext(this.constructor.name);
  }

  @Put('trigger')
  async trigger(): Promise<void> {
    await this.uploadService.findAndUploadPdfs();
  }

  async handleCronEvent(): Promise<void> {
    await this.uploadService.findAndUploadPdfs();
  }
}
