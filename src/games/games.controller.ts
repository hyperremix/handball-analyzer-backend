import { Game } from '@model';
import { Controller, Get, Query } from '@nestjs/common';
import { GamesRepository } from './games.repository';

@Controller('games')
export class GamesController {
  constructor(private gamesRepository: GamesRepository) {}

  @Get()
  getGames(@Query('leagueId') leagueId?: string): Promise<Game[]> {
    return leagueId
      ? this.gamesRepository.findManyByLeagueId(leagueId)
      : this.gamesRepository.findMany();
  }
}
