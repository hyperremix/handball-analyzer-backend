import { GameEvent } from '@model';
import { Controller, Get, Query } from '@nestjs/common';
import { GameEventsRepository } from './game-events.repository';

@Controller('game-events')
export class GameEventsController {
  constructor(private gameEventsRepository: GameEventsRepository) {}

  @Get()
  getGameEvents(@Query('leagueId') leagueId?: string): Promise<GameEvent[]> {
    return leagueId
      ? this.gameEventsRepository.findManyByLeagueId(leagueId)
      : this.gameEventsRepository.findMany();
  }
}
