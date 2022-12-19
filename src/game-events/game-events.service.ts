import { Injectable } from '@nestjs/common';
import { GameEvent, GameMetadata } from 'models';
import { GameEventsFactory } from './game-events.factory';
import { GameEventsRepository } from './game-events.repository';

@Injectable()
export class GameEventsService {
  constructor(
    private gameEventsFactory: GameEventsFactory,
    private gameEventsRepository: GameEventsRepository,
  ) {}

  async createManyGameEvents(
    gameEventStrings: string[],
    gameMetadata: GameMetadata,
  ): Promise<GameEvent[]> {
    const gameEvents = this.gameEventsFactory.createMany(gameMetadata, gameEventStrings);

    await this.gameEventsRepository.upsertMany(gameEvents);

    return gameEvents;
  }
}
