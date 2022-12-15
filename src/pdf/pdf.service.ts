import { Injectable } from '@nestjs/common';
import { GameEventsRepository } from 'game-events/game-events.repository';
import { GamesRepository } from 'games/games.repository';
import PdfParse from 'pdf-parse';
import { mapToGameEvents } from 'pdf/mapToGameEvents';
import { PlayersRepository } from 'players/players.repository';
import { TeamsService } from 'teams/teams.service';
import { extractGameStrings } from './extractGameStrings';
import { mapToGame } from './mapToGame';
import { mapToTeamAndPlayers } from './mapToTeamAndPlayers';

@Injectable()
export class PdfService {
  constructor(
    private gamesRepository: GamesRepository,
    private gameEventsRepository: GameEventsRepository,
    private teamsService: TeamsService,
    private playersRepository: PlayersRepository,
  ) {}

  async parsePdf(pdf: Buffer): Promise<void> {
    const { metadataStrings, teamDataStrings, gameEventStrings } =
      await this.extractGameEventStrings(pdf);
    const game = mapToGame(metadataStrings);
    const { teams, players } = mapToTeamAndPlayers(teamDataStrings, game.league);
    const gameEvents = mapToGameEvents(game, gameEventStrings);

    await this.gamesRepository.upsert(game);

    this.teamsService.upsertTeams(teams);

    for (const player of players) {
      await this.playersRepository.upsert(player);
    }

    for (const gameEvent of gameEvents) {
      await this.gameEventsRepository.upsert(gameEvent);
    }
  }

  private async extractGameEventStrings(pdf: Buffer): Promise<{
    metadataStrings: string[];
    teamDataStrings: string[];
    gameEventStrings: string[];
  }> {
    const { text } = await PdfParse(pdf);
    return extractGameStrings(text);
  }
}
