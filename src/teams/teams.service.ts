import { Injectable } from '@nestjs/common';
import { Game, Player, Team } from 'models';
import { PlayersService } from 'players/players.service';
import { TeamsFactory } from './teams.factory';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(
    private teamsFactory: TeamsFactory,
    private teamsRepository: TeamsRepository,
    private playersService: PlayersService,
  ) {}

  async createManyTeams(
    game: Game,
    teamDataString: string[],
  ): Promise<{ teams: Team[]; players: Player[] }> {
    const { teams, players } = this.teamsFactory.createMany(game, teamDataString);

    const existingTeams = await this.teamsRepository.findMany();

    const mergedTeams = this.mergeTeams(teams, existingTeams);
    await this.teamsRepository.upsertMany(mergedTeams);
    await this.playersService.upsertMany(players);

    return { teams: mergedTeams, players };
  }

  private mergeTeams(teams: Team[], existingTeams: Team[]): Team[] {
    return teams.map((team) => {
      const existingTeam = existingTeams.find((existingTeam) => existingTeam.id === team.id);

      return existingTeam
        ? {
            ...team,
            coaches: [
              ...existingTeam.coaches,
              ...team.coaches.filter((coach) => !existingTeam.coaches.includes(coach)),
            ],
          }
        : team;
    });
  }
}
