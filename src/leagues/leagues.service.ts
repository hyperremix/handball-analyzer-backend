import { League } from '@model';
import { Injectable } from '@nestjs/common';
import { LeaguesFactory } from './leagues.factory';
import { LeaguesRepository } from './leagues.repository';

@Injectable()
export class LeaguesService {
  constructor(
    private leaguesFactory: LeaguesFactory,
    private leaguesRepository: LeaguesRepository,
  ) {}

  createLeague(gameDate: Date, metadataStrings: string[]): Promise<League> {
    const league = this.leaguesFactory.create(gameDate, metadataStrings);
    return this.leaguesRepository.upsert(league);
  }
}
