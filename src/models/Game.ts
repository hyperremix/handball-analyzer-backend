import { GameScore } from './GameScore';

export type Game = {
  id: string;
  date: Date;
  league: string;
  winner: string;
  homeTeam: string;
  awayTeam: string;
  halftimeScore: GameScore;
  fulltimeScore: GameScore;
};
