import { Module } from '@nestjs/common';
import { GameEventsFactory } from './game-events.factory';
import { GameEventsRepository } from './game-events.repository';
import { GameEventsService } from './game-events.service';

@Module({
  providers: [GameEventsRepository, GameEventsService, GameEventsFactory],
  exports: [GameEventsRepository, GameEventsService],
})
export class GameEventsModule {}
