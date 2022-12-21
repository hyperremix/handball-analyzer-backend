import { Game, GameMetadata, GameScore, TeamMetadata } from '@model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesFactory {
  create(
    leagueId: string,
    gameMetadata: GameMetadata,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    metadataStrings: string[],
  ): Game {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultAndwinnerString = metadataStrings[4];
    const { halftimeScore, fulltimeScore } = this.extractGameScores(resultAndwinnerString);

    return {
      ...gameMetadata,
      leagueId,
      homeTeamId: homeTeamMetadata.id,
      awayTeamId: awayTeamMetadata.id,
      winnerTeamId:
        fulltimeScore.home > fulltimeScore.away ? homeTeamMetadata.id : awayTeamMetadata.id,
      halftimeScore,
      fulltimeScore,
    };
  }

  private extractGameScores(resultAndWinnerString: string): {
    halftimeScore: GameScore;
    fulltimeScore: GameScore;
  } {
    const [resultString] = resultAndWinnerString.split(' , ');

    const [fulltimeResultString, halftimeResultString] = resultString
      .replace('Endstand', '')
      .replace('(', '')
      .replace(')', '')
      .split(' ');

    const [fulltimeHomeString, fulltimeAwayString] = fulltimeResultString.split(':');
    const [halftimeHomeString, halftimeAwayString] = halftimeResultString.split(':');

    return {
      halftimeScore: {
        home: parseInt(halftimeHomeString),
        away: parseInt(halftimeAwayString),
      },
      fulltimeScore: {
        home: parseInt(fulltimeHomeString),
        away: parseInt(fulltimeAwayString),
      },
    };
  }
}
