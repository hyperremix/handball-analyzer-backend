import { Controller, Get } from '@nestjs/common';
import { Team } from 'models';
import { TeamsRepository } from './teams.repository';

@Controller('teams')
export class TeamsController {
  constructor(private teamsRepository: TeamsRepository) {}

  @Get()
  getTeams(): Promise<Team[]> {
    return this.teamsRepository.findMany();
  }
}
