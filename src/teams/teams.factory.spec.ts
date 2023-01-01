import { GameEventType } from '@model';
import { GameBuilder, GameEventBuilder, TeamBuilder, TeamMetadataBuilder } from '@model/__test__';
import { TeamsFactory } from './teams.factory';

describe('teams.factory', () => {
  let teamsFactory: TeamsFactory;

  beforeEach(() => {
    teamsFactory = new TeamsFactory();
  });

  describe('when creating', () => {
    describe('if team does not already exist', () => {
      it('then stats are calculated correctly', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.build();
        const game = GameBuilder.new.build();
        const gameEvents = [GameEventBuilder.new.build()];

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents);

        // assert
        expect(result).toEqual({
          ...teamMetadata,
          stats: {
            concededGoals: 1,
            draws: 0,
            gameEvents: {
              Goal: 1,
              Penalty: 0,
              SevenMeters: 0,
              BlueCard: 0,
              RedCard: 0,
              YellowCard: 0,
              Timeout: 0,
            },
            losses: 0,
            sevenMetersGoals: 0,
            wins: 1,
          },
        });
      });

      it('if team did not win then game counts as loss', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.withId('awayTeamId').build();
        const game = GameBuilder.new.build();
        const gameEvents = [GameEventBuilder.new.build()];

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents);

        // assert
        expect(result.stats.losses).toEqual(1);
        expect(result.stats.wins).toEqual(0);
        expect(result.stats.draws).toEqual(0);
      });

      it('if game was a draw then game counts as draw', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.withId('awayTeamId').build();
        const game = GameBuilder.new.withFulltimeScore({ home: 1, away: 1 }).build();
        const gameEvents = [GameEventBuilder.new.build()];

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents);

        // assert
        expect(result.stats.losses).toEqual(0);
        expect(result.stats.wins).toEqual(0);
        expect(result.stats.draws).toEqual(1);
      });

      it('then seven meter goals are added to goals stat', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.build();
        const game = GameBuilder.new.build();
        const gameEvents = [
          { ...GameEventBuilder.new.withType(GameEventType.SevenMeters).build(), isGoal: true },
        ];

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents);

        // assert
        expect(result.stats.gameEvents.Goal).toEqual(1);
        expect(result.stats.sevenMetersGoals).toEqual(1);
      });
    });

    describe('if team already exists', () => {
      it('then stats are calculated correctly', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.build();
        const game = GameBuilder.new.build();
        const gameEvents = [GameEventBuilder.new.build()];
        const existingTeam = TeamBuilder.new.build();

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents, existingTeam);

        // assert
        expect(result).toEqual({
          ...teamMetadata,
          stats: {
            concededGoals: 2,
            draws: 1,
            gameEvents: {
              Goal: 2,
              Penalty: 1,
              SevenMeters: 1,
              BlueCard: 1,
              RedCard: 1,
              YellowCard: 1,
              Timeout: 1,
            },
            losses: 1,
            sevenMetersGoals: 1,
            wins: 2,
          },
        });
      });

      it('if team did not win then game counts as loss', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.withId('awayTeamId').build();
        const game = GameBuilder.new.build();
        const gameEvents = [GameEventBuilder.new.build()];
        const existingTeam = TeamBuilder.new.build();

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents, existingTeam);

        // assert
        expect(result.stats.losses).toEqual(2);
        expect(result.stats.wins).toEqual(1);
        expect(result.stats.draws).toEqual(1);
      });

      it('if game was a draw then game counts as draw', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.withId('awayTeamId').build();
        const game = GameBuilder.new.withFulltimeScore({ home: 1, away: 1 }).build();
        const gameEvents = [GameEventBuilder.new.build()];
        const existingTeam = TeamBuilder.new.build();

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents, existingTeam);

        // assert
        expect(result.stats.losses).toEqual(1);
        expect(result.stats.wins).toEqual(1);
        expect(result.stats.draws).toEqual(2);
      });

      it('then seven meter goals are added to goals stat', () => {
        // arrange
        const teamMetadata = TeamMetadataBuilder.new.build();
        const game = GameBuilder.new.build();
        const gameEvents = [
          { ...GameEventBuilder.new.withType(GameEventType.SevenMeters).build(), isGoal: true },
        ];
        const existingTeam = TeamBuilder.new.build();

        // act
        const result = teamsFactory.create(teamMetadata, game, gameEvents, existingTeam);

        // assert
        expect(result.stats.gameEvents.Goal).toEqual(2);
        expect(result.stats.sevenMetersGoals).toEqual(2);
      });
    });
  });
});
