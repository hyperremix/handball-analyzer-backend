import {
  Game,
  GameEvent,
  GameEventSevenMeters,
  GameEventType,
  Player,
  Team,
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
      coaches: [
        ...existingTeam.coaches,
        ...teamMetadata.coaches.filter((coach) => !existingTeam.coaches.includes(coach)),
      ],
      players: [
        ...existingTeam.players,
        ...teamMetadata.players.filter(
          (player) =>
            !existingTeam.players.some((existingPlayer) => existingPlayer.id === player.id),
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

    const newStats: Team['stats'] = {
      gameEvents: groupedGameEvents,
      wins: game.winnerTeamId === teamMetadata.id ? 1 : 0,
      losses: game.winnerTeamId !== teamMetadata.id ? 1 : 0,
      draws: game.fulltimeScore.home === game.fulltimeScore.away ? 1 : 0,
      points: game.winnerTeamId === teamMetadata.id ? 2 : 0,
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
      points: existingTeam.stats.points + newStats.points,
      sevenMetersGoals: existingTeam.stats.sevenMetersGoals + newSevenMetersGoals,
      concededGoals: existingTeam.stats.concededGoals + newStats.concededGoals,
    };
  }

  createGameEventsStats(teamId: string, gameEvents: GameEvent[]): Record<GameEventType, number> {
    const gameEventsStats: Record<GameEventType, number> = {
      [GameEventType.Goal]: 0,
      [GameEventType.Penalty]: 0,
      [GameEventType.SevenMeters]: 0,
      [GameEventType.RedCard]: 0,
      [GameEventType.YellowCard]: 0,
      [GameEventType.Timeout]: 0,
      [GameEventType.Penalty]: 0,
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

    const homeCoaches = this.mapToCoaches(homeCoachesStrings);
    const awayCoaches = this.mapToCoaches(awayCoachesStrings);
    const homeTeam = this.mapToTeam(homeTeamString, leagueId, homeCoaches);
    const awayTeam = this.mapToTeam(awayTeamString, leagueId, awayCoaches);
    const homePlayers = this.mapToManyPlayers(homePlayerStrings, homeTeam.id);
    const awayPlayers = this.mapToManyPlayers(awayPlayerStrings, awayTeam.id);

    homeTeam.players = homePlayers;
    awayTeam.players = awayPlayers;

    return { homeTeam, awayTeam };
  }

  mapToCoaches = (coachesStrings: string[]): string[] =>
    coachesStrings.map((coachString) => coachString.slice(1)).filter((coach) => coach !== '');

  mapToTeam = (teamString: string, leagueId: string, coaches: string[]): TeamMetadata => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, name] = teamString.split(': ');

    return {
      id: getUuidByString(`${leagueId} ${name}`),
      leagueId,
      name,
      coaches,
      players: [],
    };
  };

  mapToManyPlayers = (playerStrings: string[], teamId: string): Player[] =>
    playerStrings.map((playerString) => this.mapToPlayer(playerString, teamId));

  mapToPlayer = (playerString: string, teamId: string): Player => {
    const playerNumberRegex = /^\d{1,2}/;
    const playerNameRegex = /[^\d:/]+/;

    const numberMatch = playerString.match(playerNumberRegex);
    const number = numberMatch ? parseInt(numberMatch[0]) : 0;
    const nameMatch = playerString.match(playerNameRegex);
    const name = nameMatch ? nameMatch[0] : 'N/A';

    return {
      id: getUuidByString(`${teamId} ${number} ${name}`),
      name,
      number,
    };
  };
}
