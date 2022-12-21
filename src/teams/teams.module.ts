import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsFactory } from './teams.factory';
import { TeamsRepository } from './teams.repository';
import { TeamsService } from './teams.service';

@Module({
  providers: [TeamsRepository, TeamsService, TeamsFactory],
  exports: [TeamsRepository, TeamsService, TeamsFactory],
  controllers: [TeamsController],
})
export class TeamsModule {}
