import { unmarshallDates } from './unmarshallDates';

describe('unmarshallDates', () => {
  describe('when unmarshalling dates', () => {
    it('if property is undefined then undefined is returned', () => {
      // act
      const result = unmarshallDates(undefined);

      // assert
      expect(result).toBe(undefined);
    });

    it('if property is null then null is returned', () => {
      // act
      const result = unmarshallDates(null);

      // assert
      expect(result).toBe(null);
    });

    it('if property is an array then array is returned', () => {
      // act
      const result = unmarshallDates([1, 2, { a: 'b' }]);

      // assert
      expect(result).toEqual([1, 2, { a: 'b' }]);
    });

    it('if property is an object then object is returned', () => {
      // act
      const result = unmarshallDates({ a: 1, b: { a: 1, b: 2 } });

      // assert
      expect(result).toEqual({ a: 1, b: { a: 1, b: 2 } });
    });

    it('if property is a string and it is a date then date is returned', () => {
      // act
      const result = unmarshallDates('2022-02-28T12:00:00.000Z');

      // assert
      expect(result).toEqual(new Date('2022-02-28T12:00:00.000Z'));
    });

    it('if property is a string and it is not a date then property is returned', () => {
      // act
      const result = unmarshallDates('not a date');

      // assert
      expect(result).toEqual('not a date');
    });
  });
});
