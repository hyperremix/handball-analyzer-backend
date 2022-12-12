import { Module } from '@nestjs/common';
import { PlayersRepository } from './players.repository';

@Module({
  providers: [PlayersRepository],
  exports: [PlayersRepository],
})
export class PlayersModule {}
