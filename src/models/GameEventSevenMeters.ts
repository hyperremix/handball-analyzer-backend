import { BaseGameEvent } from './BaseGameEvent';
import { GameEventType } from './GameEventType';
import { GameScore } from './GameScore';

export type GameEventSevenMeters = BaseGameEvent<GameEventType.SevenMeters> & {
  playerId: string;
  isGoal: boolean;
  score?: GameScore;
};
