import { Injectable } from '@nestjs/common';
import { League } from 'models';
import { LeaguesFactory } from './leagues.factory';
import { LeaguesRepository } from './leagues.repository';

@Injectable()
export class LeaguesService {
  constructor(
    private leaguesFactory: LeaguesFactory,
    private leaguesRepository: LeaguesRepository,
  ) {}

  createLeague(metadataStrings: string[]): Promise<League> {
    const league = this.leaguesFactory.create(metadataStrings);
    return this.leaguesRepository.upsert(league);
  }
}
