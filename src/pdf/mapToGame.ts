import { Game, GameScore } from '../models';

export const mapToGame = (metadataStrings: string[]): Game => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [leagueString, idandDateString, _, homeTeamAndawayTeamString, resultAndwinnerString] =
    metadataStrings;
  const league = extractLeague(leagueString);
  const { id, date } = extractIdAndDate(idandDateString);
  const { homeTeamId, awayTeamId } = extractHomeTeamAndAwayTeam(homeTeamAndawayTeamString, league);
  const { halftimeScore, fulltimeScore, winnerTeamId } = extractGameScoresAndWinner(
    resultAndwinnerString,
    league,
  );

  return {
    id,
    date,
    league,
    winnerTeamId,
    homeTeamId,
    awayTeamId,
    halftimeScore,
    fulltimeScore,
  };
};

const extractLeague = (leagueString: string): string => {
  const game = leagueString.match(/\((.*)\)/);
  if (!game) {
    throw new Error(`Could not extract league from: ${leagueString}`);
  }

  return game[1].trim();
};

const extractIdAndDate = (idAndDateString: string): { id: string; date: Date } => {
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
};

const extractHomeTeamAndAwayTeam = (
  homeTeamAndAwayTeamString: string,
  league: string,
): {
  homeTeamId: string;
  awayTeamId: string;
} => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, homeTeamString, awayTeam] = homeTeamAndAwayTeamString.split(' - ');
  const homeTeam = homeTeamString.replace('Gast', '').trim();
  return {
    homeTeamId: `${league} ${homeTeam}`,
    awayTeamId: `${league} ${awayTeam.trim()}`,
  };
};

const extractGameScoresAndWinner = (
  resultAndWinnerString: string,
  league: string,
): {
  halftimeScore: GameScore;
  fulltimeScore: GameScore;
  winnerTeamId: string;
} => {
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
};
