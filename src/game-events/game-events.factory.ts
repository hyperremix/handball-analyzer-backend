import {
  Game,
  GameEvent,
  GameEventGoal,
  gameEventIndicatorMap,
  GameEventPenalty,
  GameEventRedCard,
  GameEventSevenMeters,
  GameEventTimeout,
  GameEventType,
  GameEventYellowCard,
  GameScore,
  TeamMetadata,
} from '@model';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import getUuidByString from 'uuid-by-string';

const daytimePattern = /^\d{2}:\d{2}:\d{2}/;
const scoreRegexp = /\d{1,2}:\d{1,2}(?!m)/;
const playerNumberAndTeamRegexp = /\(\d{1,2}, .*\)/;

@Injectable()
export class GameEventsFactory {
  createMany(
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    gameEventStrings: string[],
  ): GameEvent[] {
    return gameEventStrings.map((gameEventString: any) =>
      this.create(game, homeTeamMetadata, awayTeamMetadata, gameEventString),
    );
  }

  create(
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    gameEvent: string,
  ): GameEvent {
    const daytime = this.createDaytime(game.date, gameEvent);
    const eventWithoutDaytime = gameEvent.replace(daytimePattern, '').trim();
    const elapsedSeconds = this.createElapsedSeconds(eventWithoutDaytime.substring(0, 5));
    const eventWithoutTime = eventWithoutDaytime.substring(5, eventWithoutDaytime.length).trim();
    const score = this.createScore(eventWithoutTime);
    const eventWithoutTimeAndScore = eventWithoutTime.replace(scoreRegexp, '').trim();

    for (const [key, value] of Object.entries(gameEventIndicatorMap)) {
      const gameEventType = key as GameEventType;
      const indicator = value;
      const gameEvent = this.createGameEvent(
        game,
        homeTeamMetadata,
        awayTeamMetadata,
        eventWithoutTimeAndScore,
        gameEventType,
        indicator,
        daytime,
        elapsedSeconds,
        score,
      );
      if (gameEvent) {
        return gameEvent;
      }
    }

    throw new Error(`Could not create game event: ${gameEvent}`);
  }

  private createGameEvent = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    gameEvent: string,
    gameEventType: GameEventType,
    indicator: string,
    daytime: Date,
    elapsedSeconds: number,
    score?: GameScore,
  ): GameEvent | undefined => {
    const isGame = gameEvent.includes(indicator);
    if (!isGame) {
      return;
    }

    switch (gameEventType) {
      case GameEventType.Goal:
        return this.createGameEventGoal(
          game,
          homeTeamMetadata,
          awayTeamMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
          score,
        );
      case GameEventType.SevenMeters:
        return this.createGameEventSevenMeters(
          game,
          homeTeamMetadata,
          awayTeamMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
          score,
        );
      case GameEventType.Penalty:
        return this.createPenalty(
          game,
          homeTeamMetadata,
          awayTeamMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
        );
      case GameEventType.Timeout:
        return this.createTimeout(
          game,
          homeTeamMetadata,
          awayTeamMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
        );
      case GameEventType.YellowCard:
        return this.createYellowCard(
          game,
          homeTeamMetadata,
          awayTeamMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
        );
      case GameEventType.RedCard:
        return this.createRedCard(
          game,
          homeTeamMetadata,
          awayTeamMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
        );
    }
  };

  private createGameEventGoal = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    type: GameEventType.Goal,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
    score?: GameScore,
  ): GameEventGoal => {
    if (!score) {
      throw new Error(`Could not create score from game event: ${gameEvent}`);
    }

    const [playerNumber, shortTeamName] = this.createPlayerNumberAndTeam(gameEvent);
    const playerName = gameEvent
      .replace(gameEventIndicatorMap[GameEventType.Goal], '')
      .replace(playerNumberAndTeamRegexp, '')
      .trim();
    const teamId = this.getTeamId(homeTeamMetadata, awayTeamMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: uuidv4(),
      gameId: game.id,
      leagueId: game.leagueId,
      daytime,
      elapsedSeconds,
      score,
      playerId,
      teamId,
    };
  };

  private createGameEventSevenMeters = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    type: GameEventType.SevenMeters,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
    score?: GameScore,
  ): GameEventSevenMeters => {
    const isGoal = !gameEvent.includes('KEIN');
    const [playerNumber, shortTeamName] = this.createPlayerNumberAndTeam(gameEvent);
    const playerName = gameEvent
      .replace('7m, KEIN', '')
      .replace('7m-', '')
      .replace('Tor durch', '')
      .replace(playerNumberAndTeamRegexp, '')
      .trim();
    const teamId = this.getTeamId(homeTeamMetadata, awayTeamMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: uuidv4(),
      gameId: game.id,
      leagueId: game.leagueId,
      daytime,
      elapsedSeconds,
      isGoal,
      score,
      playerId,
      teamId,
    };
  };

  private createPenalty = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    type: GameEventType.Penalty,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
  ): GameEventPenalty => {
    const [playerNumber, shortTeamName] = this.createPlayerNumberAndTeam(gameEvent);
    const playerName = gameEvent
      .replace(gameEventIndicatorMap[GameEventType.Penalty], '')
      .replace(playerNumberAndTeamRegexp, '')
      .trim();
    const teamId = this.getTeamId(homeTeamMetadata, awayTeamMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: uuidv4(),
      gameId: game.id,
      leagueId: game.leagueId,
      daytime,
      elapsedSeconds,
      playerId,
      teamId,
    };
  };

  private createTimeout = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    type: GameEventType.Timeout,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
  ): GameEventTimeout => {
    const shortTeamName = gameEvent
      .replace(gameEventIndicatorMap[GameEventType.Timeout], '')
      .trim();
    const teamId = this.getTeamId(homeTeamMetadata, awayTeamMetadata, shortTeamName);

    return {
      type,
      id: uuidv4(),
      gameId: game.id,
      leagueId: game.leagueId,
      daytime,
      elapsedSeconds,
      teamId,
    };
  };

  private createYellowCard = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    type: GameEventType.YellowCard,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
  ): GameEventYellowCard => {
    const [playerNumber, shortTeamName] = this.createPlayerNumberAndTeam(gameEvent);
    const playerName = gameEvent
      .replace(gameEventIndicatorMap[GameEventType.YellowCard], '')
      .replace(playerNumberAndTeamRegexp, '')
      .trim();
    const teamId = this.getTeamId(homeTeamMetadata, awayTeamMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: uuidv4(),
      gameId: game.id,
      leagueId: game.leagueId,
      daytime,
      elapsedSeconds,
      playerId,
      teamId,
    };
  };

  private createRedCard = (
    game: Game,
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    type: GameEventType.RedCard,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
  ): GameEventRedCard => {
    const [playerNumber, shortTeamName] = this.createPlayerNumberAndTeam(gameEvent);
    const playerName = gameEvent
      .replace(gameEventIndicatorMap[GameEventType.RedCard], '')
      .replace(playerNumberAndTeamRegexp, '')
      .trim();
    const teamId = this.getTeamId(homeTeamMetadata, awayTeamMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: uuidv4(),
      gameId: game.id,
      leagueId: game.leagueId,
      daytime,
      elapsedSeconds,
      playerId,
      teamId,
    };
  };

  private createDaytime = (date: Date, gameEvent: string): Date => {
    const game = gameEvent.match(daytimePattern);
    if (!game) {
      throw new Error(`Could not create daytime from: ${gameEvent}`);
    }

    const [hour, minute, second] = game[0].split(':').map((value) => parseInt(value));
    const daytime = new Date(date);
    daytime.setHours(hour);
    daytime.setMinutes(minute);
    daytime.setSeconds(second);
    daytime.setMilliseconds(0);

    return daytime;
  };

  private createElapsedSeconds = (timeString: string): number => {
    const [minute, second] = timeString.split(':').map((value) => parseInt(value));
    return minute * 60 + second;
  };

  private createScore = (gameEvent: string): GameScore | undefined => {
    const scoreString = gameEvent.match(scoreRegexp);
    const score = scoreString ? scoreString[0].split(':') : '';
    return score
      ? {
          home: parseInt(score[0]),
          away: parseInt(score[1]),
        }
      : undefined;
  };

  private createPlayerNumberAndTeam = (gameEvent: string): [number, string] => {
    const playerAndTeamString = gameEvent.match(playerNumberAndTeamRegexp);
    const playerAndTeam = playerAndTeamString
      ? playerAndTeamString[0].replace('(', '').replace(')', '').split(', ')
      : '';
    return [parseInt(playerAndTeam[0]), playerAndTeam[1]];
  };

  private getTeamId = (
    homeTeamMetadata: TeamMetadata,
    awayTeamMetadata: TeamMetadata,
    shortTeamName: string,
  ): string =>
    homeTeamMetadata.name.includes(shortTeamName) ? homeTeamMetadata.id : awayTeamMetadata.id;

  private getPlayerId = (teamId: string, playerNumber: number, playerName: string): string =>
    getUuidByString(`${teamId} ${playerNumber} ${playerName}`);
}
