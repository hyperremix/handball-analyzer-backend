import { Module } from '@nestjs/common';
import { GameEventsFactory } from './game-events.factory';
import { GameEventsRepository } from './game-events.repository';
import { GameEventsService } from './game-events.service';
import { GameEventsController } from './game-events.controller';

@Module({
  providers: [GameEventsRepository, GameEventsService, GameEventsFactory],
  exports: [GameEventsRepository, GameEventsService],
  controllers: [GameEventsController],
})
export class GameEventsModule {}
