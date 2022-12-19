import { Injectable } from '@nestjs/common';
import {
  GameEvent,
  GameEventGoal,
  gameEventIndicatorMap,
  GameEventPenalty,
  GameEventRedCard,
  GameEventSevenMeters,
  GameEventTimeout,
  GameEventType,
  GameEventYellowCard,
  GameMetadata,
  GameScore,
} from 'models';

const daytimePattern = /^\d{2}:\d{2}:\d{2}/;
const scoreRegexp = /\d{1,2}:\d{1,2}(?!m)/;
const playerNumberAndTeamRegexp = /\(\d{1,2}, .*\)/;

@Injectable()
export class GameEventsFactory {
  createMany(gameMetadata: GameMetadata, gameEventStrings: string[]): GameEvent[] {
    return gameEventStrings.map((gameEventString: any) =>
      this.create(gameMetadata, gameEventString),
    );
  }

  create(gameMetadata: GameMetadata, gameEvent: string): GameEvent {
    const daytime = this.createDaytime(gameMetadata.date, gameEvent);
    const eventWithoutDaytime = gameEvent.replace(daytimePattern, '').trim();
    const elapsedSeconds = this.createElapsedSeconds(eventWithoutDaytime.substring(0, 5));
    const eventWithoutTime = eventWithoutDaytime.substring(5, eventWithoutDaytime.length).trim();
    const score = this.createScore(eventWithoutTime);
    const eventWithoutTimeAndScore = eventWithoutTime.replace(scoreRegexp, '').trim();

    for (const [key, value] of Object.entries(gameEventIndicatorMap)) {
      const gameEventType = key as GameEventType;
      const indicator = value;
      const gameEvent = this.createGameEvent(
        gameMetadata,
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
    gameMetadata: GameMetadata,
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
          gameMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
          score,
        );
      case GameEventType.SevenMeters:
        return this.createGameEventSevenMeters(
          gameMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
          score,
        );
      case GameEventType.Penalty:
        return this.createPenalty(gameMetadata, gameEventType, gameEvent, daytime, elapsedSeconds);
      case GameEventType.Timeout:
        return this.createTimeout(gameMetadata, gameEventType, gameEvent, daytime, elapsedSeconds);
      case GameEventType.YellowCard:
        return this.createYellowCard(
          gameMetadata,
          gameEventType,
          gameEvent,
          daytime,
          elapsedSeconds,
        );
      case GameEventType.RedCard:
        return this.createRedCard(gameMetadata, gameEventType, gameEvent, daytime, elapsedSeconds);
    }
  };

  private createGameEventGoal = (
    gameMetadata: GameMetadata,
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
    const teamId = this.getTeamId(gameMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: this.getGameEventId(gameMetadata, type, elapsedSeconds),
      gameId: gameMetadata.id,
      daytime,
      elapsedSeconds,
      score,
      playerId,
      teamId,
    };
  };

  private createGameEventSevenMeters = (
    gameMetadata: GameMetadata,
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
    const teamId = this.getTeamId(gameMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: this.getGameEventId(gameMetadata, type, elapsedSeconds),
      gameId: gameMetadata.id,
      daytime,
      elapsedSeconds,
      isGoal,
      score,
      playerId,
      teamId,
    };
  };

  private createPenalty = (
    gameMetadata: GameMetadata,
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
    const teamId = this.getTeamId(gameMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: this.getGameEventId(gameMetadata, type, elapsedSeconds),
      gameId: gameMetadata.id,
      daytime,
      elapsedSeconds,
      playerId,
      teamId,
    };
  };

  private createTimeout = (
    gameMetadata: GameMetadata,
    type: GameEventType.Timeout,
    gameEvent: string,
    daytime: Date,
    elapsedSeconds: number,
  ): GameEventTimeout => {
    const shortTeamName = gameEvent
      .replace(gameEventIndicatorMap[GameEventType.Timeout], '')
      .trim();
    const teamId = this.getTeamId(gameMetadata, shortTeamName);

    return {
      type,
      id: this.getGameEventId(gameMetadata, type, elapsedSeconds),
      gameId: gameMetadata.id,
      daytime,
      elapsedSeconds,
      teamId,
    };
  };

  private createYellowCard = (
    gameMetadata: GameMetadata,
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
    const teamId = this.getTeamId(gameMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: this.getGameEventId(gameMetadata, type, elapsedSeconds),
      gameId: gameMetadata.id,
      daytime,
      elapsedSeconds,
      playerId,
      teamId,
    };
  };

  private createRedCard = (
    gameMetadata: GameMetadata,
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
    const teamId = this.getTeamId(gameMetadata, shortTeamName);
    const playerId = this.getPlayerId(teamId, playerNumber, playerName);

    return {
      type,
      id: this.getGameEventId(gameMetadata, type, elapsedSeconds),
      gameId: gameMetadata.id,
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

  private getGameEventId = (
    gameMetadata: GameMetadata,
    type: GameEventType,
    elapsedSeconds: number,
  ): string => gameMetadata.id + type + elapsedSeconds;

  private getTeamId = (gameMetadata: GameMetadata, shortTeamName: string): string =>
    gameMetadata.homeTeamId.includes(shortTeamName)
      ? gameMetadata.homeTeamId
      : gameMetadata.awayTeamId;

  private getPlayerId = (teamId: string, playerNumber: number, playerName: string): string =>
    `${teamId} ${playerNumber} ${playerName}`;
}
