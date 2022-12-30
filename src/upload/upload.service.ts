import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'config';
import { S3Service } from 's3/s3.service';
import { Handball4AllResponse } from './Handball4AllResponse';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(
    private uploadRepository: UploadRepository,
    private s3Service: S3Service,
    private configService: ConfigService,
  ) {}

  async findAndUploadPdfs(): Promise<void> {
    const pdfs = await this.uploadRepository.findMany();

    const alreadyParsedGameIds = pdfs
      .map((pdf) => pdf.id)
      .reduce((acc, id) => acc.add(id), new Set());

    const handball4allResponse = await axios.get<Handball4AllResponse[]>(
      'https://spo.handball4all.de/service/if_g_json.php?ca=1&cl=95086&cmd=ps&og=81',
    );

    for (const game of handball4allResponse.data[0].content.futureGames.games) {
      const gameNotPlayed =
        game.gHomeGoals === ' ' || (game.gHomeGoals === '0' && game.gGuestGoals === '0');
      if (alreadyParsedGameIds.has(game.gNo) || gameNotPlayed) {
        continue;
      }

      const pdfResponse = await axios.get(
        `https://spo.handball4all.de/misc/sboPublicReports.php?sGID=${game.sGID}`,
        {
          responseType: 'arraybuffer',
        },
      );

      const pdfBuffer = Buffer.from(pdfResponse.data, 'binary');

      await this.s3Service.upload(
        this.configService.aws.s3.buckets.pdf,
        'application/pdf',
        `${game.gNo}.pdf`,
        pdfBuffer,
      );

      await this.uploadRepository.upsert({
        id: game.gNo,
        s3UploadAt: new Date(),
      });
    }
  }
}
