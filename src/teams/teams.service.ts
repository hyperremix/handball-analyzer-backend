import { Injectable } from '@nestjs/common';
import { Team } from 'models';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(private teamsRepository: TeamsRepository) {}

  async upsertTeams(teams: Team[]): Promise<void> {
    const existingTeams = await this.teamsRepository.findMany();
    for (const team of teams) {
      this.upsertTeam(team, existingTeams);
    }
  }

  private async upsertTeam(team: Team, existingTeams: Team[]): Promise<void> {
    const existingTeam = existingTeams.find((existingTeam) => existingTeam.id === team.id);

    if (!existingTeam) {
      await this.teamsRepository.upsert(team);
      return;
    }

    await this.teamsRepository.upsert({
      ...team,
      coaches: [
        ...existingTeam.coaches,
        ...team.coaches.filter((coach) => !existingTeam.coaches.includes(coach)),
      ],
    });
  }
}
