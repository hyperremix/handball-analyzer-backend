import { Injectable } from '@nestjs/common';
import { Game, GameEvent } from 'models';
import { GameEventsFactory } from './game-events.factory';
import { GameEventsRepository } from './game-events.repository';

@Injectable()
export class GameEventsService {
  constructor(
    private gameEventsFactory: GameEventsFactory,
    private gameEventsRepository: GameEventsRepository,
  ) {}

  async createManyGameEvents(game: Game, gameEventStrings: string[]): Promise<GameEvent[]> {
    const gameEvents = this.gameEventsFactory.createMany(game, gameEventStrings);

    await this.gameEventsRepository.upsertMany(gameEvents);

    return gameEvents;
  }
}
