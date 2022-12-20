import { GameMetadata } from '@model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameMetadataFactory {
  create(metadataStrings: string[]): GameMetadata {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, idandDateString] = metadataStrings;

    const { id, date } = this.extractIdAndDate(idandDateString);

    return {
      id,
      date,
    };
  }

  private extractIdAndDate(idAndDateString: string): { id: string; date: Date } {
    const [idString, datetimeString] = idAndDateString.split(' , am ');
    const [dateString, timeString] = datetimeString.split(' um ');
    const [day, month, year] = dateString.split('.');
    const [hour, minute] = timeString.split(':');

    const id = idString.replace('Spiel/Datum', '').trim();
    const date = new Date(
      parseInt(year) + 2000,
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
    );

    return {
      id,
      date,
    };
  }
}
