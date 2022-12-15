import { Module } from '@nestjs/common';
import { PlayersModule } from 'players/players.module';
import { TeamsFactory } from './teams.factory';
import { TeamsRepository } from './teams.repository';
import { TeamsService } from './teams.service';

@Module({
  imports: [PlayersModule],
  providers: [TeamsRepository, TeamsService, TeamsFactory],
  exports: [TeamsRepository, TeamsService],
})
export class TeamsModule {}
