import { BaseGameEvent } from './BaseGameEvent';
import { GameEventType } from './GameEventType';

export type GameEventPenalty = BaseGameEvent<GameEventType.Penalty> & {
  playerId: string;
};
