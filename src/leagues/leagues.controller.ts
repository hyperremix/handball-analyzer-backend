import { Controller, Get } from '@nestjs/common';
import { League } from 'models';
import { LeaguesRepository } from './leagues.repository';

@Controller('leagues')
export class LeaguesController {
  constructor(private leaguesRepository: LeaguesRepository) {}

  @Get()
  getLeagues(): Promise<League[]> {
    return this.leaguesRepository.findMany();
  }
}
