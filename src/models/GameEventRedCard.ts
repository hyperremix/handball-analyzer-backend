import { BaseGameEvent } from './BaseGameEvent';
import { GameEventType } from './GameEventType';

export type GameEventRedCard = BaseGameEvent<GameEventType.RedCard> & {
  playerId: string;
};
