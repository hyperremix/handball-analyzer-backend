import { League } from '@model';
import { Injectable } from '@nestjs/common';
import getUuidByString from 'uuid-by-string';

@Injectable()
export class LeaguesFactory {
  create(gameDate: Date, metadataStrings: string[]): League {
    const [leagueString] = metadataStrings;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, leaguePart] = leagueString.split(':');
    const [leagueNameString, leagueSlugString] = leaguePart.split('(');
    const slug = leagueSlugString.replace('(', '').replace(')', '').trim();
    const season = this.getSeason(gameDate);

    return {
      id: getUuidByString(`${season}-${slug}`),
      season,
      name: leagueNameString.trim(),
      slug,
    };
  }

  private getSeason(date: Date): string {
    const year = date.getFullYear();

    return date.getMonth() < 6 ? `${year - 1}/${year}` : `${year}/${year + 1}`;
  }
}
