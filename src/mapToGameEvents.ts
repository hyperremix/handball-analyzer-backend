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
} from './models';

const daytimePattern = /^\d{2}:\d{2}:\d{2}/;
const scoreRegexp = /\d{1,2}:\d{1,2}/;
const playerNumberAndTeamRegexp = /\(\d{1,2}, .*\)/;

export const mapToGameEvents = (game: Game, gameEvents: string[]): GameEvent[] => {
  return gameEvents.map((gameEvent) => mapToGameEvent(game, gameEvent));
};

const mapToGameEvent = (game: Game, gameEvent: string): GameEvent => {
  const daytime = extractDaytime(game.date, gameEvent);
  const eventWithoutDaytime = gameEvent.replace(daytimePattern, '').trim();
  const elapsedSeconds = extractElapsedSeconds(eventWithoutDaytime.substring(0, 5));
  const eventWithoutTime = eventWithoutDaytime.substring(5, eventWithoutDaytime.length).trim();
  const score = extractScore(eventWithoutTime);
  const eventWithoutTimeAndScore = eventWithoutTime.replace(scoreRegexp, '').trim();

  for (const [key, value] of Object.entries(gameEventIndicatorMap)) {
    const gameEventType = key as GameEventType;
    const indicator = value;
    const gameEvent = extractGameEvent(
      game,
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

  throw new Error(`Could not map game event: ${gameEvent}`);
};

const extractGameEvent = (
  game: Game,
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
      return extractGameEventGoal(game, gameEventType, gameEvent, daytime, elapsedSeconds, score);
    case GameEventType.SevenMeters:
      return extractGameEventSevenMeters(
        game,
        gameEventType,
        gameEvent,
        daytime,
        elapsedSeconds,
        score,
      );
    case GameEventType.Penalty:
      return extractPenalty(game, gameEventType, gameEvent, daytime, elapsedSeconds);
    case GameEventType.Timeout:
      return extractTimeout(game, gameEventType, gameEvent, daytime, elapsedSeconds);
    case GameEventType.YellowCard:
      return extractYellowCard(game, gameEventType, gameEvent, daytime, elapsedSeconds);
    case GameEventType.RedCard:
      return extractRedCard(game, gameEventType, gameEvent, daytime, elapsedSeconds);
  }
};

const extractGameEventGoal = (
  game: Game,
  type: GameEventType.Goal,
  gameEvent: string,
  daytime: Date,
  elapsedSeconds: number,
  score?: GameScore,
): GameEventGoal => {
  if (!score) {
    throw new Error(`Could not extract score from game event: ${gameEvent}`);
  }

  const [playerNumber, team] = extractPlayerNumberAndTeam(gameEvent);
  const playerName = gameEvent
    .replace(gameEventIndicatorMap[GameEventType.Goal], '')
    .replace(playerNumberAndTeamRegexp, '')
    .trim();

  return {
    type,
    id: game.id + type + elapsedSeconds,
    gameId: game.id,
    daytime,
    elapsedSeconds,
    score,
    playerId: 'todo',
    teamId: 'todo',
  };
};

const extractGameEventSevenMeters = (
  game: Game,
  type: GameEventType.SevenMeters,
  gameEvent: string,
  daytime: Date,
  elapsedSeconds: number,
  score?: GameScore,
): GameEventSevenMeters => {
  const isGoal = !gameEvent.includes('KEIN');
  const [playerNumber, team] = extractPlayerNumberAndTeam(gameEvent);
  const playerName = gameEvent
    .replace('7m, KEIN', '')
    .replace('7m-', '')
    .replace('Tor durch', '')
    .replace(playerNumberAndTeamRegexp, '')
    .trim();

  return {
    type,
    id: game.id + type + elapsedSeconds,
    gameId: game.id,
    daytime,
    elapsedSeconds,
    isGoal,
    score,
    playerId: 'todo',
    teamId: 'todo',
  };
};

const extractPenalty = (
  game: Game,
  type: GameEventType.Penalty,
  gameEvent: string,
  daytime: Date,
  elapsedSeconds: number,
): GameEventPenalty => {
  const [playerNumber, team] = extractPlayerNumberAndTeam(gameEvent);
  const playerName = gameEvent
    .replace(gameEventIndicatorMap[GameEventType.Penalty], '')
    .replace(playerNumberAndTeamRegexp, '')
    .trim();

  return {
    type,
    id: game.id + type + elapsedSeconds,
    gameId: game.id,
    daytime,
    elapsedSeconds,
    playerId: 'todo',
    teamId: 'todo',
  };
};

const extractTimeout = (
  game: Game,
  type: GameEventType.Timeout,
  gameEvent: string,
  daytime: Date,
  elapsedSeconds: number,
): GameEventTimeout => {
  const team = gameEvent.replace(gameEventIndicatorMap[GameEventType.Timeout], '').trim();

  return {
    type,
    id: game.id + type + elapsedSeconds,
    gameId: game.id,
    daytime,
    elapsedSeconds,
    teamId: 'todo',
  };
};

const extractYellowCard = (
  game: Game,
  type: GameEventType.YellowCard,
  gameEvent: string,
  daytime: Date,
  elapsedSeconds: number,
): GameEventYellowCard => {
  const [playerNumber, team] = extractPlayerNumberAndTeam(gameEvent);

  const playerName = gameEvent
    .replace(gameEventIndicatorMap[GameEventType.YellowCard], '')
    .replace(playerNumberAndTeamRegexp, '')
    .trim();

  return {
    type,
    id: game.id + type + elapsedSeconds,
    gameId: game.id,
    daytime,
    elapsedSeconds,
    playerId: 'todo',
    teamId: 'todo',
  };
};

const extractRedCard = (
  game: Game,
  type: GameEventType.RedCard,
  gameEvent: string,
  daytime: Date,
  elapsedSeconds: number,
): GameEventRedCard => {
  const [playerNumber, team] = extractPlayerNumberAndTeam(gameEvent);

  const playerName = gameEvent
    .replace(gameEventIndicatorMap[GameEventType.RedCard], '')
    .replace(playerNumberAndTeamRegexp, '')
    .trim();

  return {
    type,
    id: game.id + type + elapsedSeconds,
    gameId: game.id,
    daytime,
    elapsedSeconds,
    playerId: 'todo',
    teamId: 'todo',
  };
};

const extractDaytime = (date: Date, gameEvent: string): Date => {
  const game = gameEvent.match(daytimePattern);
  if (!game) {
    throw new Error(`Could not extract daytime from: ${gameEvent}`);
  }

  const [hour, minute, second] = game[0].split(':').map((value) => parseInt(value));
  const daytime = new Date(date);
  daytime.setHours(hour);
  daytime.setMinutes(minute);
  daytime.setSeconds(second);
  daytime.setMilliseconds(0);

  return daytime;
};

const extractElapsedSeconds = (timeString: string): number => {
  const [minute, second] = timeString.split(':').map((value) => parseInt(value));
  return minute * 60 + second;
};

const extractScore = (gameEvent: string): GameScore | undefined => {
  const scoreString = gameEvent.match(scoreRegexp);
  const score = scoreString ? scoreString[0].split(':') : '';
  return score
    ? {
        home: parseInt(score[0]),
        away: parseInt(score[1]),
      }
    : undefined;
};

const extractPlayerNumberAndTeam = (gameEvent: string): [number, string] => {
  const playerAndTeamString = gameEvent.match(playerNumberAndTeamRegexp);
  const playerAndTeam = playerAndTeamString
    ? playerAndTeamString[0].replace('(', '').replace(')', '').split(', ')
    : '';
  return [parseInt(playerAndTeam[0]), playerAndTeam[1]];
};
