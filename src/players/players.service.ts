import { Injectable } from '@nestjs/common';
import { Player } from 'models';
import { PlayersRepository } from './players.repository';

@Injectable()
export class PlayersService {
  constructor(private playersRepository: PlayersRepository) {}

  async upsertMany(players: Player[]): Promise<void> {
    await this.playersRepository.upsertMany(players);
  }
}
