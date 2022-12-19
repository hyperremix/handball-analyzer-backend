import { GameScore } from './GameScore';

export type Game = {
  id: string;
  date: Date;
  leagueId: string;
  winnerTeamId: string;
  homeTeamId: string;
  awayTeamId: string;
  halftimeScore: GameScore;
  fulltimeScore: GameScore;
};
