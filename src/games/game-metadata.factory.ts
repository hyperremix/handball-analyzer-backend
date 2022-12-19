import { Injectable } from '@nestjs/common';
import { GameMetadata } from 'models';

@Injectable()
export class GameMetadataFactory {
  create(metadataStrings: string[]): GameMetadata {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [leagueString, idandDateString, __, homeTeamAndawayTeamString] = metadataStrings;

    const leagueId = this.extractLeagueId(leagueString);
    const { id, date } = this.extractIdAndDate(idandDateString);
    const { homeTeamId, awayTeamId } = this.extractHomeTeamAndAwayTeam(
      homeTeamAndawayTeamString,
      leagueId,
    );

    return {
      id,
      leagueId,
      date,
      homeTeamId,
      awayTeamId,
    };
  }

  private extractIdAndDate(idAndDateString: string): { id: string; date: Date } {
    const [idString, datetimeString] = idAndDateString.split(' , am ');
    const [dateString, timeString] = datetimeString.split(' um ');
    const [day, month, year] = dateString.split('.');
    const [hour, minute] = timeString.split(':');

    const id = idString.replace('Spiel/Datum', '').trim();
    const date = new Date(
      parseInt(year) + 2000,
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
    );

    return {
      id,
      date,
    };
  }

  private extractLeagueId(leagueString: string): string {
    const game = leagueString.match(/\((.*)\)/);
    if (!game) {
      throw new Error(`Could not extract league from: ${leagueString}`);
    }

    return game[1].trim();
  }

  private extractHomeTeamAndAwayTeam(
    homeTeamAndAwayTeamString: string,
    leagueId: string,
  ): {
    homeTeamId: string;
    awayTeamId: string;
  } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, homeTeamString, awayTeam] = homeTeamAndAwayTeamString.split(' - ');
    const homeTeam = homeTeamString.replace('Gast', '').trim();
    return {
      homeTeamId: `${leagueId} ${homeTeam}`,
      awayTeamId: `${leagueId} ${awayTeam.trim()}`,
    };
  }
}
