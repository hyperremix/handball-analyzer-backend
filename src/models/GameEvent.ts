import { GameEventGoal } from './GameEventGoal';
import { GameEventPenalty } from './GameEventPenalty';
import { GameEventRedCard } from './GameEventRedCard';
import { GameEventSevenMeters } from './GameEventSevenMeters';
import { GameEventTimeout } from './GameEventTimeout';
import { GameEventYellowCard } from './GameEventYellowCard';

export type GameEvent =
  | GameEventGoal
  | GameEventSevenMeters
  | GameEventPenalty
  | GameEventTimeout
  | GameEventYellowCard
  | GameEventRedCard;
