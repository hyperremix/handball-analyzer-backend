import { Controller, Get } from '@nestjs/common';
import { Game } from 'models';
import { GamesRepository } from './games.repository';

@Controller('games')
export class GamesController {
  constructor(private gamesRepository: GamesRepository) {}

  @Get()
  getGames(): Promise<Game[]> {
    return this.gamesRepository.findMany();
  }
}
