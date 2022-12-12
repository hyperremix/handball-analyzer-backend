import { Game, GameScore } from './models';

export const mapToMetadata = (metadataStrings: string[]): Game => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [leagueString, idandDateString, _, homeTeamAndawayTeamString, resultAndwinnerString] =
    metadataStrings;
  const league = extractLeague(leagueString);
  const { id, date } = extractIdAndDate(idandDateString);
  const { homeTeam, awayTeam } = extractHomeTeamAndAwayTeam(homeTeamAndawayTeamString);
  const { halftimeScore, fulltimeScore, winner } =
    extractGameScoresAndWinner(resultAndwinnerString);

  return {
    id,
    date,
    league,
    winner,
    homeTeam,
    awayTeam,
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
): {
  homeTeam: string;
  awayTeam: string;
} => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, homeTeamString, awayTeam] = homeTeamAndAwayTeamString.split(' - ');
  const homeTeam = homeTeamString.replace('Gast', '').trim();
  return {
    homeTeam,
    awayTeam: awayTeam.trim(),
  };
};

const extractGameScoresAndWinner = (
  resultAndWinnerString: string,
): {
  halftimeScore: GameScore;
  fulltimeScore: GameScore;
  winner: string;
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
  const winner = winnerString
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
    winner,
  };
};
