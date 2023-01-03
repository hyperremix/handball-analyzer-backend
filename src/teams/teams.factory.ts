import {
  Game,
  GameEvent,
  GameEventSevenMeters,
  GameEventType,
  Team,
  TeamMember,
  TeamMemberType,
  TeamMetadata,
} from '@model';
import { Injectable } from '@nestjs/common';
import getUuidByString from 'uuid-by-string';

@Injectable()
export class TeamsFactory {
  createMany(
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    game: Game,
    gameEvents: GameEvent[],
    existingHomeTeam?: Team,
    existingAwayTeam?: Team,
  ): Team[] {
    const homeTeam = this.create(homeTeamMetadata, game, gameEvents, existingHomeTeam);
    const awayTeam = this.create(awayTeamMetadata, game, gameEvents, existingAwayTeam);

    return [homeTeam, awayTeam];
  }

  create(
    teamMetadata: TeamMetadata,
    game: Game,
    gameEvents: GameEvent[],
    existingTeam?: Team,
  ): Team {
    const teamStats = this.createTeamStats(teamMetadata, game, gameEvents, existingTeam);

    if (!existingTeam) {
      return {
        ...teamMetadata,
        stats: teamStats,
      };
    }

    return {
      ...existingTeam,
      ...teamMetadata,
      teamMembers: [
        ...existingTeam.teamMembers,
        ...teamMetadata.teamMembers.filter(
          (player) =>
            !existingTeam.teamMembers.some((existingMember) => existingMember.id === player.id),
        ),
      ],
      stats: teamStats,
    };
  }

  createTeamStats(
    teamMetadata: TeamMetadata,
    game: Game,
    gameEvents: GameEvent[],
    existingTeam?: Team,
  ): Team['stats'] {
    const groupedGameEvents = this.createGameEventsStats(teamMetadata.id, gameEvents);
    const newSevenMetersGoals = this.createSevenMetersGoals(
      teamMetadata.id,
      gameEvents.filter(
        (gameEvent) => gameEvent.type === GameEventType.SevenMeters,
      ) as GameEventSevenMeters[],
    );
    const gameResult = this.getGameResult(game, teamMetadata.id);

    const newStats: Team['stats'] = {
      gameEvents: groupedGameEvents,
      ...gameResult,
      sevenMetersGoals: newSevenMetersGoals,
      concededGoals:
        teamMetadata.id === game.homeTeamId ? game.fulltimeScore.away : game.fulltimeScore.home,
    };

    if (!existingTeam) {
      return newStats;
    }

    return {
      gameEvents: {
        [GameEventType.Goal]:
          existingTeam.stats.gameEvents[GameEventType.Goal] + groupedGameEvents[GameEventType.Goal],
        [GameEventType.Penalty]:
          existingTeam.stats.gameEvents[GameEventType.Penalty] +
          groupedGameEvents[GameEventType.Penalty],
        [GameEventType.SevenMeters]:
          existingTeam.stats.gameEvents[GameEventType.SevenMeters] +
          groupedGameEvents[GameEventType.SevenMeters],
        [GameEventType.BlueCard]:
          existingTeam.stats.gameEvents[GameEventType.BlueCard] +
          groupedGameEvents[GameEventType.BlueCard],
        [GameEventType.RedCard]:
          existingTeam.stats.gameEvents[GameEventType.RedCard] +
          groupedGameEvents[GameEventType.RedCard],
        [GameEventType.YellowCard]:
          existingTeam.stats.gameEvents[GameEventType.YellowCard] +
          groupedGameEvents[GameEventType.YellowCard],
        [GameEventType.Timeout]:
          existingTeam.stats.gameEvents[GameEventType.Timeout] +
          groupedGameEvents[GameEventType.Timeout],
        [GameEventType.Penalty]:
          existingTeam.stats.gameEvents[GameEventType.Penalty] +
          groupedGameEvents[GameEventType.Penalty],
      },
      wins: existingTeam.stats.wins + newStats.wins,
      losses: existingTeam.stats.losses + newStats.losses,
      draws: existingTeam.stats.draws + newStats.draws,
      sevenMetersGoals: existingTeam.stats.sevenMetersGoals + newSevenMetersGoals,
      concededGoals: existingTeam.stats.concededGoals + newStats.concededGoals,
    };
  }

  getGameResult(game: Game, teamId: string): { wins: number; losses: number; draws: number } {
    const result = {
      wins: 0,
      losses: 0,
      draws: 0,
    };

    if (game.fulltimeScore.home === game.fulltimeScore.away) {
      return {
        ...result,
        draws: 1,
      };
    }

    return {
      wins: game.winnerTeamId === teamId ? 1 : 0,
      losses: game.winnerTeamId !== teamId ? 1 : 0,
      draws: 0,
    };
  }

  createGameEventsStats(teamId: string, gameEvents: GameEvent[]): Record<GameEventType, number> {
    const gameEventsStats: Record<GameEventType, number> = {
      [GameEventType.Goal]: 0,
      [GameEventType.Penalty]: 0,
      [GameEventType.SevenMeters]: 0,
      [GameEventType.BlueCard]: 0,
      [GameEventType.RedCard]: 0,
      [GameEventType.YellowCard]: 0,
      [GameEventType.Timeout]: 0,
    };

    gameEvents.forEach((gameEvent) => {
      if (gameEvent.teamId !== teamId) {
        return;
      }

      gameEventsStats[gameEvent.type]++;

      if (gameEvent.type === GameEventType.SevenMeters && gameEvent.isGoal) {
        gameEventsStats[GameEventType.Goal]++;
      }
    });

    return gameEventsStats;
  }

  createSevenMetersGoals(teamId: string, gameEvents: GameEventSevenMeters[]): number {
    return gameEvents.filter((gameEvent) => gameEvent.teamId === teamId && gameEvent.isGoal).length;
  }

  createManyMetadata(
    leagueId: string,
    teamDataStrings: string[],
  ): { homeTeam: TeamMetadata; awayTeam: TeamMetadata } {
    const homeTeamStartIndex = teamDataStrings.findIndex((line) => line.includes('Heim'));
    const homeTeamEndIndex = teamDataStrings.findIndex((line) => line.includes('Gast'));
    const homeTeamStrings = teamDataStrings.slice(homeTeamStartIndex, homeTeamEndIndex);
    const homeTeamString = homeTeamStrings[0];
    const homeRestStrings = homeTeamStrings.slice(12);
    const homePlayerStringsEndIndex = homeRestStrings.findIndex((line) => line.startsWith('A'));
    const homePlayerStrings = homeRestStrings.slice(0, homePlayerStringsEndIndex);
    const homeCoachesEndIndex = homeRestStrings.findIndex((line) => line.startsWith('D'));
    const homeCoachesStrings = homeRestStrings.slice(
      homePlayerStringsEndIndex,
      homeCoachesEndIndex + 1,
    );

    const awayTeamStartIndex = teamDataStrings.findIndex((line) => line.includes('Gast'));
    const awayTeamStrings = teamDataStrings.slice(awayTeamStartIndex);
    const awayTeamString = awayTeamStrings[0];
    const awayRestStrings = awayTeamStrings.slice(12);
    const awayPlayerStringsEndIndex = awayRestStrings.findIndex((line) => line.startsWith('A'));
    const awayPlayerStrings = awayRestStrings.slice(0, awayPlayerStringsEndIndex);
    const awayCoachesEndIndex = awayRestStrings.findIndex((line) => line.startsWith('D'));
    const awayCoachesStrings = awayRestStrings.slice(
      awayPlayerStringsEndIndex,
      awayCoachesEndIndex + 1,
    );

    const homeTeam = this.mapToTeam(homeTeamString, leagueId);
    const awayTeam = this.mapToTeam(awayTeamString, leagueId);
    const homeCoaches = this.mapToCoaches(homeCoachesStrings, homeTeam.id);
    const awayCoaches = this.mapToCoaches(awayCoachesStrings, awayTeam.id);
    const homePlayers = this.mapToManyPlayers(homePlayerStrings, homeTeam.id);
    const awayPlayers = this.mapToManyPlayers(awayPlayerStrings, awayTeam.id);

    homeTeam.teamMembers = [...homePlayers, ...homeCoaches];
    awayTeam.teamMembers = [...awayPlayers, ...awayCoaches];

    return { homeTeam, awayTeam };
  }

  mapToCoaches = (coachesStrings: string[], teamId: string): TeamMember[] =>
    coachesStrings
      .map((coachString) => {
        const number = coachString.slice(0, 1);
        if (number === '') {
          return undefined;
        }

        const coachNameString = coachString.slice(1);
        if (coachNameString === '' || coachNameString === undefined) {
          return undefined;
        }

        const name = coachNameString.replace(/[\d:]*/g, '');

        return {
          id: getUuidByString(`${teamId} ${number} ${name}`),
          number,
          name: name,
          type: TeamMemberType.Coach,
        };
      })
      .filter((coach) => coach !== undefined) as TeamMember[];

  mapToTeam = (teamString: string, leagueId: string): TeamMetadata => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, name] = teamString.split(': ');

    return {
      id: getUuidByString(`${leagueId} ${name}`),
      leagueId,
      name,
      teamMembers: [],
    };
  };

  mapToManyPlayers = (playerStrings: string[], teamId: string): TeamMember[] =>
    playerStrings.map((playerString) => this.mapToPlayer(playerString, teamId));

  mapToPlayer = (playerString: string, teamId: string): TeamMember => {
    const playerNumberRegex = /^\d{1,2}/;
    const playerNameRegex = /[^\d:/]+/;

    const numberMatch = playerString.match(playerNumberRegex);
    const number = numberMatch ? numberMatch[0] : 'N/A';
    const nameMatch = playerString.match(playerNameRegex);
    const name = nameMatch ? nameMatch[0] : 'N/A';

    return {
      id: getUuidByString(`${teamId} ${number} ${name}`),
      name,
      number,
      type: TeamMemberType.Player,
    };
  };
}
