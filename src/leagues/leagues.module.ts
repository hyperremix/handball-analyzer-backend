import { Module } from '@nestjs/common';
import { LeaguesFactory } from './leagues.factory';
import { LeaguesRepository } from './leagues.repository';
import { LeaguesService } from './leagues.service';

@Module({
  providers: [LeaguesRepository, LeaguesService, LeaguesFactory],
  exports: [LeaguesRepository, LeaguesService],
})
export class LeaguesModule {}
