import { Module } from '@nestjs/common';
import { TeamsRepository } from './teams.repository';

@Module({
  providers: [TeamsRepository],
  exports: [TeamsRepository],
})
export class TeamsModule {}
