import { Injectable } from '@nestjs/common';
import { GameEventsService } from 'game-events/game-events.service';
import { GameMetadataFactory } from 'games/game-metadata.factory';
import { GamesService } from 'games/games.service';
import { LeaguesService } from 'leagues/leagues.service';
import PdfParse from 'pdf-parse';
import { TeamsService } from 'teams/teams.service';

const daytimePattern = /^\d{2}:\d{2}:\d{2}/;

@Injectable()
export class PdfService {
  constructor(
    private gamesService: GamesService,
    private gameEventsService: GameEventsService,
    private teamsService: TeamsService,
    private leaguesService: LeaguesService,
    private gameMetadataFactory: GameMetadataFactory,
  ) {}

  async parsePdf(pdf: Buffer): Promise<void> {
    const { text } = await PdfParse(pdf);
    const { metadataStrings, teamDataStrings, gameEventStrings } = this.extractGameStrings(text);

    const gameMetadata = this.gameMetadataFactory.create(metadataStrings);
    const league = await this.leaguesService.createLeague(gameMetadata.date, metadataStrings);
    const game = await this.gamesService.createGame(league.id, gameMetadata, metadataStrings);

    await this.gameEventsService.createManyGameEvents(gameEventStrings, game);
    await this.teamsService.createManyTeams(league.id, teamDataStrings);
  }

  private extractGameStrings(pdfText: string): {
    metadataStrings: string[];
    teamDataStrings: string[];
    gameEventStrings: string[];
  } {
    const lines = pdfText.split('\n');

    const metadataStartIndex = lines.findIndex((line) => line.includes('Übersicht Spieldaten'));
    const metadataEndIndex = lines.findIndex((line) => line.includes('Schiedsrichter'));
    const metadataStrings = lines.slice(metadataStartIndex + 1, metadataEndIndex);

    const teamDataStartIndex = lines.findIndex((line) => line.includes('Mannschaftslisten'));
    const teamDataEndIndex = lines.findIndex((line) =>
      line.includes('ZeitSpielzeitSpielstandAktion'),
    );
    const teamDataStrings = lines.slice(teamDataStartIndex + 1, teamDataEndIndex - 1);
    const gameEventStrings = lines.slice(teamDataEndIndex + 1, lines.length);

    return {
      metadataStrings,
      teamDataStrings,
      gameEventStrings: gameEventStrings.filter((line) => line.match(daytimePattern)),
    };
  }
}
