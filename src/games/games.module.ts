import { Module } from '@nestjs/common';
import { GamesRepository } from './games.repository';

@Module({
  providers: [GamesRepository],
  exports: [GamesRepository],
})
export class GamesModule {}
