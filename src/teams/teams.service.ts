import { Team } from '@model';
import { Injectable } from '@nestjs/common';
import { TeamsFactory } from './teams.factory';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(private teamsFactory: TeamsFactory, private teamsRepository: TeamsRepository) {}

  async createManyTeams(leagueId: string, teamDataString: string[]): Promise<Team[]> {
    const teams = this.teamsFactory.createMany(leagueId, teamDataString);

    const existingTeams = await this.teamsRepository.findMany();

    const mergedTeams = this.mergeTeams(teams, existingTeams);
    await this.teamsRepository.upsertMany(mergedTeams);

    return mergedTeams;
  }

  private mergeTeams(teams: Team[], existingTeams: Team[]): Team[] {
    return teams.map((team) => {
      const existingTeam = existingTeams.find((existingTeam) => existingTeam.id === team.id);

      return this.mergeTeam(team, existingTeam);
    });
  }

  private mergeTeam(team: Team, existingTeam?: Team): Team {
    return existingTeam
      ? {
          ...team,
          coaches: [
            ...existingTeam.coaches,
            ...team.coaches.filter((coach) => !existingTeam.coaches.includes(coach)),
          ],
          players: [
            ...existingTeam.players,
            ...team.players.filter(
              (player) =>
                !existingTeam.players.some((existingPlayer) => existingPlayer.id === player.id),
            ),
          ],
        }
      : team;
  }
}
