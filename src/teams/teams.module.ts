import { Module } from '@nestjs/common';
import { TeamsRepository } from './teams.repository';
import { TeamsService } from './teams.service';

@Module({
  providers: [TeamsRepository, TeamsService],
  exports: [TeamsRepository, TeamsService],
})
export class TeamsModule {}
