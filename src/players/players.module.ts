import { Module } from '@nestjs/common';
import { PlayersRepository } from './players.repository';
import { PlayersService } from './players.service';

@Module({
  providers: [PlayersRepository, PlayersService],
  exports: [PlayersRepository, PlayersService],
})
export class PlayersModule {}
