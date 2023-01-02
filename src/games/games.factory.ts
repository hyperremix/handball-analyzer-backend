import { Game, GameMetadata, GameScore, Referee, TeamMetadata } from '@model';
import { Injectable } from '@nestjs/common';
import getUuidByString from 'uuid-by-string';

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
    const refereesStrings = [metadataStrings[7], metadataStrings[8]];
    const { halftimeScore, fulltimeScore } = this.extractGameScores(resultAndwinnerString);
    const referees = this.extractReferees(refereesStrings);

    return {
      ...gameMetadata,
      leagueId,
      homeTeamId: homeTeamMetadata.id,
      awayTeamId: awayTeamMetadata.id,
      winnerTeamId:
        fulltimeScore.home > fulltimeScore.away ? homeTeamMetadata.id : awayTeamMetadata.id,
      halftimeScore,
      fulltimeScore,
      referees,
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

  private extractReferees(refereesStrings: string[]): Referee[] {
    if (refereesStrings.length !== 2) {
      return [];
    }

    const referees: Referee[] = [];

    const refereeNamesString = refereesStrings[0].replace('Name', '');
    const refereeClubsString = refereesStrings[1].replace('Verein', '');

    const { firstRefereeName, secondRefereeName } = this.extractRefereeNames(refereeNamesString);
    const { firstRefereeClub, secondRefereeClub } = this.extractRefereeClubs(refereeClubsString);

    if (firstRefereeName && firstRefereeClub) {
      referees.push({
        id: getUuidByString(`${firstRefereeName}-${firstRefereeClub}`),
        name: firstRefereeName,
        club: firstRefereeClub,
      });
    }

    if (secondRefereeName && secondRefereeClub) {
      referees.push({
        id: getUuidByString(`${secondRefereeName}-${secondRefereeClub}`),
        name: secondRefereeName,
        club: secondRefereeClub,
      });
    }

    return referees;
  }

  private extractRefereeNames(refereeNamesString: string): {
    firstRefereeName?: string;
    secondRefereeName?: string;
  } {
    const refereeNamesParts = refereeNamesString.split(' ');

    for (let i = 0; i < refereeNamesParts.length; i++) {
      const names = this.extractNames(refereeNamesParts, i);
      if (!names) {
        continue;
      }

      return {
        firstRefereeName: names.first,
        secondRefereeName: names.second,
      };
    }

    return { firstRefereeName: refereeNamesParts.join(' ') };
  }

  private extractRefereeClubs(refereeClubsString: string): {
    firstRefereeClub?: string;
    secondRefereeClub?: string;
  } {
    const refereeClubsParts = refereeClubsString.split(' ');

    for (let i = 0; i < refereeClubsParts.length; i++) {
      const names = this.extractNames(refereeClubsParts, i);
      if (!names) {
        continue;
      }

      return {
        firstRefereeClub: names.first,
        secondRefereeClub: names.second,
      };
    }

    return { firstRefereeClub: refereeClubsParts.join(' ') };
  }

  private extractNames(
    parts: string[],
    index: number,
  ): { first: string; second: string } | undefined {
    const part = parts[index];
    if (this.isAbbreviation(part)) {
      return undefined;
    }

    // TODO: Handle cases like "Hans Peter-Müller" or "Hans-Peter Müller"
    const secondCapitalLetterIndex = this.secondCapitalLetterIndex(part);

    if (secondCapitalLetterIndex === -1) {
      return undefined;
    }

    const firstPart = part.slice(0, secondCapitalLetterIndex);
    const secondPart = part.slice(secondCapitalLetterIndex);

    return {
      first: [...parts.slice(0, index), firstPart].join(' '),
      second: [secondPart, ...parts.slice(index + 1)].join(' '),
    };
  }

  private isAbbreviation(text: string): boolean {
    return text === text.toUpperCase();
  }

  private secondCapitalLetterIndex(text: string): number {
    return text.split('').findIndex((char, index) => char === char.toUpperCase() && index > 0);
  }
}
