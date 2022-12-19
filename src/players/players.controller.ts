import { Controller, Get } from '@nestjs/common';
import { Player } from 'models';
import { PlayersRepository } from './players.repository';

@Controller('players')
export class PlayersController {
  constructor(private playersRepository: PlayersRepository) {}

  @Get()
  getPlayers(): Promise<Player[]> {
    return this.playersRepository.findMany();
  }
}
