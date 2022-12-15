import { Injectable } from '@nestjs/common';
import { Game } from 'models';
import { GamesFactory } from './games.factory';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private gamesFactory: GamesFactory, private gamesRepository: GamesRepository) {}

  createGame(metadataStrings: string[]): Promise<Game> {
    const game = this.gamesFactory.create(metadataStrings);
    return this.gamesRepository.upsert(game);
  }
}
