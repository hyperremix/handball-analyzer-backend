import { Game, GameEvent, TeamMetadata } from '@model';
import { Injectable } from '@nestjs/common';
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
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
  ): Promise<GameEvent[]> {
    const gameEvents = this.gameEventsFactory.createMany(
      game,
      homeTeamMetadata,
      awayTeamMetadata,
      gameEventStrings,
    );

    await this.gameEventsRepository.upsertMany(gameEvents);

    return gameEvents;
  }
}
