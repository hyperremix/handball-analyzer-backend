import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from 'config';
import { DbModule } from 'db';
import { ErrorInterceptor } from 'errors/error.interceptor';
import { LoggerModule } from 'logger';
import { GameEventsModule } from './game-events/game-events.module';
import { GamesModule } from './games/games.module';
import { LeaguesModule } from './leagues/leagues.module';
import { PdfModule } from './pdf/pdf.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
  imports: [
    ConfigModule,
    LoggerModule,
    DbModule,
    PdfModule,
    TeamsModule,
    GamesModule,
    GameEventsModule,
    LeaguesModule,
  ],
})
export class AppModule {}
