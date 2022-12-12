import { BaseGameEvent } from './BaseGameEvent';
import { GameEventType } from './GameEventType';

export type GameEventTimeout = BaseGameEvent<GameEventType.Timeout>;
