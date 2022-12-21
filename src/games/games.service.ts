import { Game, GameMetadata, TeamMetadata } from '@model';
import { Injectable } from '@nestjs/common';
import { GamesFactory } from './games.factory';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private gamesFactory: GamesFactory, private gamesRepository: GamesRepository) {}

  createGame(
    leagueId: string,
    gameMetadata: GameMetadata,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    metadataStrings: string[],
  ): Promise<Game> {
    const game = this.gamesFactory.create(
      leagueId,
      gameMetadata,
      homeTeamMetadata,
      awayTeamMetadata,
      metadataStrings,
    );
    return this.gamesRepository.upsert(game);
  }
}
