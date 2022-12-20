import { Game, GameMetadata, GameScore } from '@model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesFactory {
  create(leagueId: string, gameMetadata: GameMetadata, metadataStrings: string[]): Game {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, __, ___, homeTeamAndawayTeamString, resultAndwinnerString] = metadataStrings;
    const { homeTeamId, awayTeamId } = this.extractHomeTeamAndAwayTeam(
      homeTeamAndawayTeamString,
      leagueId,
    );
    const { halftimeScore, fulltimeScore, winnerTeamId } = this.extractGameScoresAndWinner(
      resultAndwinnerString,
      leagueId,
    );

    return {
      ...gameMetadata,
      leagueId,
      homeTeamId,
      awayTeamId,
      winnerTeamId,
      halftimeScore,
      fulltimeScore,
    };
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

  private extractGameScoresAndWinner(
    resultAndWinnerString: string,
    leagueId: string,
  ): {
    halftimeScore: GameScore;
    fulltimeScore: GameScore;
    winnerTeamId: string;
  } {
    const [resultString, winnerString] = resultAndWinnerString.split(' , ');

    const [fulltimeResultString, halftimeResultString] = resultString
      .replace('Endstand', '')
      .replace('(', '')
      .replace(')', '')
      .split(' ');

    const [fulltimeHomeString, fulltimeAwayString] = fulltimeResultString.split(':');
    const [halftimeHomeString, halftimeAwayString] = halftimeResultString.split(':');

    const winnerStartString = 'Sieger ';
    const winnerStartIndex = winnerString.indexOf('Sieger ');
    const winnerEndIndex = winnerString.indexOf('Zuschauer');
    const winnerTeam = winnerString
      .substring(winnerStartIndex + winnerStartString.length, winnerEndIndex)
      .trim();

    return {
      halftimeScore: {
        home: parseInt(halftimeHomeString),
        away: parseInt(halftimeAwayString),
      },
      fulltimeScore: {
        home: parseInt(fulltimeHomeString),
        away: parseInt(fulltimeAwayString),
      },
      winnerTeamId: `${leagueId} ${winnerTeam}`,
    };
  }
}
