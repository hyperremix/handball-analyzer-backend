import { Player, Team } from '@model';
import { Injectable } from '@nestjs/common';
import getUuidByString from 'uuid-by-string';

@Injectable()
export class TeamsFactory {
  createMany(leagueId: string, teamDataStrings: string[]): Team[] {
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

    return [homeTeam, awayTeam];
  }

  mapToCoaches = (coachesStrings: string[]): string[] =>
    coachesStrings.map((coachString) => coachString.slice(1)).filter((coach) => coach !== '');

  mapToTeam = (teamString: string, leagueId: string, coaches: string[]): Team => {
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
