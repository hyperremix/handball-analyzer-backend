import { GameScore } from './GameScore';

export type Game = {
  id: string;
  date: Date;
  league: string;
  winnerTeamId: string;
  homeTeamId: string;
  awayTeamId: string;
  halftimeScore: GameScore;
  fulltimeScore: GameScore;
};
