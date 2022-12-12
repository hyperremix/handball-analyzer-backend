import { BaseGameEvent } from './BaseGameEvent';
import { GameEventType } from './GameEventType';
import { GameScore } from './GameScore';

export type GameEventGoal = BaseGameEvent<GameEventType.Goal> & {
  playerId: string;
  score: GameScore;
};
