import { Injectable } from '@nestjs/common';
import { League } from 'models';

@Injectable()
export class LeaguesFactory {
  create(metadataStrings: string[]): League {
    const [leagueString] = metadataStrings;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, leaguePart] = leagueString.split(':');
    const [leagueName, leagueId] = leaguePart.split('(');

    return {
      id: leagueId.replace('(', '').replace(')', '').trim(),
      name: leagueName.trim(),
    };
  }
}
