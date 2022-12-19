import { Controller, Get } from '@nestjs/common';
import { GameEvent } from 'models';
import { GameEventsRepository } from './game-events.repository';

@Controller('game-events')
export class GameEventsController {
  constructor(private gameEventsRepository: GameEventsRepository) {}

  @Get()
  getGameEvents(): Promise<GameEvent[]> {
    return this.gameEventsRepository.findMany();
  }
}
