import { BaseGameEvent } from './BaseGameEvent';
import { GameEventType } from './GameEventType';

export type GameEventYellowCard = BaseGameEvent<GameEventType.YellowCard> & {
  playerId: string;
};
