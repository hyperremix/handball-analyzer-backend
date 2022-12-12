import { GameEventType } from './GameEventType';

export type BaseGameEvent<T extends GameEventType> = {
  type: T;
  id: string;
  gameId: string;
  daytime: Date;
  elapsedSeconds: number;
  teamId: string;
};
