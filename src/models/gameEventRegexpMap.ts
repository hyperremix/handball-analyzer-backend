import { GameEventType } from './GameEventType';

export const gameEventIndicatorMap: Record<GameEventType, string> = {
  [GameEventType.SevenMeters]: '7m',
  [GameEventType.Goal]: 'Tor durch',
  [GameEventType.Penalty]: '2-min Strafe für',
  [GameEventType.Timeout]: 'Auszeit',
  [GameEventType.YellowCard]: 'Verwarnung für',
  [GameEventType.RedCard]: 'Disqualifikation für',
};
