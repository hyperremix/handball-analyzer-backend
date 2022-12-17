import { Module } from '@nestjs/common';
import { GameEventsModule } from 'game-events/game-events.module';
import { GamesModule } from 'games/games.module';
import { LeaguesModule } from 'leagues/leagues.module';
import { S3Module } from 's3/s3.module';
import { TeamsModule } from 'teams/teams.module';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [S3Module, TeamsModule, GamesModule, GameEventsModule, LeaguesModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
