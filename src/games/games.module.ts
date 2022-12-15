import { Module } from '@nestjs/common';
import { GamesFactory } from './games.factory';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';

@Module({
  providers: [GamesRepository, GamesService, GamesFactory],
  exports: [GamesRepository, GamesService],
})
export class GamesModule {}
