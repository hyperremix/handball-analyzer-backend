import { Module } from '@nestjs/common';
import { ConfigModule } from 'config';
import { DbModule } from 'db';
import { LoggerModule } from 'logger';
import { GameEventsModule } from './game-events/game-events.module';
import { GamesModule } from './games/games.module';
import { PdfModule } from './pdf/pdf.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DbModule,
    PdfModule,
    TeamsModule,
    PlayersModule,
    GamesModule,
    GameEventsModule,
  ],
})
export class AppModule {}
