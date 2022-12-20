import { Team } from '@model';
import { Controller, Get, Query } from '@nestjs/common';
import { TeamsRepository } from './teams.repository';

@Controller('teams')
export class TeamsController {
  constructor(private teamsRepository: TeamsRepository) {}

  @Get()
  getTeams(@Query('leagueId') leagueId?: string): Promise<Team[]> {
    return leagueId
      ? this.teamsRepository.findManyByLeagueId(leagueId)
      : this.teamsRepository.findMany();
  }
}
