import { Module } from '@nestjs/common';
import { GameMetadataFactory } from './game-metadata.factory';
import { GamesController } from './games.controller';
import { GamesFactory } from './games.factory';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';

@Module({
  providers: [GamesRepository, GamesService, GamesFactory, GameMetadataFactory],
  exports: [GamesRepository, GamesService, GameMetadataFactory],
  controllers: [GamesController],
})
export class GamesModule {}
