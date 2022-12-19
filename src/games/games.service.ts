import { Injectable } from '@nestjs/common';
import { Game, GameMetadata } from 'models';
import { GamesFactory } from './games.factory';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private gamesFactory: GamesFactory, private gamesRepository: GamesRepository) {}

  createGame(gameMetadata: GameMetadata, metadataStrings: string[]): Promise<Game> {
    const game = this.gamesFactory.create(gameMetadata, metadataStrings);
    return this.gamesRepository.upsert(game);
  }
}
