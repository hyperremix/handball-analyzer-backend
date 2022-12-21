import { Game, GameEvent, Team, TeamMetadata } from '@model';
import { Injectable } from '@nestjs/common';
import { TeamsFactory } from './teams.factory';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(private teamsFactory: TeamsFactory, private teamsRepository: TeamsRepository) {}

  async createManyTeams(
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    game: Game,
    gameEvents: GameEvent[],
  ): Promise<Team[]> {
    const existingTeams = await this.teamsRepository.findMany();

    const existingHomeTeam = existingTeams.find((team) => team.name === homeTeamMetadata.name);
    const existingAwayTeam = existingTeams.find((team) => team.name === awayTeamMetadata.name);

    const teams = this.teamsFactory.createMany(
      homeTeamMetadata,
      awayTeamMetadata,
      game,
      gameEvents,
      existingHomeTeam,
      existingAwayTeam,
    );

    await this.teamsRepository.upsertMany(teams);
    return teams;
  }
}
