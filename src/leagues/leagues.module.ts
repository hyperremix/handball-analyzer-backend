import { Module } from '@nestjs/common';
import { LeaguesFactory } from './leagues.factory';
import { LeaguesRepository } from './leagues.repository';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';

@Module({
  providers: [LeaguesRepository, LeaguesService, LeaguesFactory],
  exports: [LeaguesRepository, LeaguesService],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
