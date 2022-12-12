import { Module } from '@nestjs/common';
import { GameEventsRepository } from './game-events.repository';

@Module({
  providers: [GameEventsRepository],
  exports: [GameEventsRepository],
})
export class GameEventsModule {}
