import { Injectable } from '@nestjs/common';
import { Game, GameMetadata, GameScore } from 'models';

@Injectable()
export class GamesFactory {
  create(gameMetadata: GameMetadata, metadataStrings: string[]): Game {
    const resultAndwinnerString = metadataStrings[4];
    const { halftimeScore, fulltimeScore, winnerTeamId } = this.extractGameScoresAndWinner(
      resultAndwinnerString,
      gameMetadata.leagueId,
    );

    return {
      ...gameMetadata,
      winnerTeamId,
      halftimeScore,
      fulltimeScore,
    };
  }

  private extractGameScoresAndWinner(
    resultAndWinnerString: string,
    league: string,
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
      winnerTeamId: `${league} ${winnerTeam}`,
    };
  }
}
