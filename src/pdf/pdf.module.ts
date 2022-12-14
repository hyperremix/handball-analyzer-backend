import { Module } from '@nestjs/common';
import { ConfigModule } from 'config';
import { DbModule } from 'db';
import { GameEventsModule } from 'game-events/game-events.module';
import { GamesModule } from 'games/games.module';
import { LeaguesModule } from 'leagues/leagues.module';
import { LoggerModule } from 'logger';
import { S3Module } from 's3/s3.module';
import { TeamsModule } from 'teams/teams.module';
import { PdfController } from './pdf.controller';
import { PdfRepository } from './pdf.repository';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DbModule,
    S3Module,
    TeamsModule,
    GamesModule,
    GameEventsModule,
    LeaguesModule,
  ],
  controllers: [PdfController],
  providers: [PdfService, PdfRepository],
})
export class PdfModule {}
