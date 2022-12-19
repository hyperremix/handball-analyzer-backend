import { Module } from '@nestjs/common';
import { PlayersRepository } from './players.repository';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';

@Module({
  providers: [PlayersRepository, PlayersService],
  exports: [PlayersRepository, PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
