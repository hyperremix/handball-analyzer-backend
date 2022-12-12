import { isDate } from './isDate';

describe('isDate', () => {
  describe('when checking if string is date', () => {
    it('if string is empty then false is returned', () => {
      // act
      const result = isDate('');

      // assert
      expect(result).toBe(false);
    });

    it('if string is not a date then false is returned', () => {
      // act
      const result = isDate('not a date');

      // assert
      expect(result).toBe(false);
    });

    it('if string is an invalid date then false is returned', () => {
      // act
      const result = isDate('2022-02-30T12:00:00.000+01:00');

      // assert
      expect(result).toBe(false);
    });

    fit('if string is a valid date then true is returned', () => {
      // act
      const result = isDate('2022-02-28T12:00:00.000+01:00');

      // assert
      expect(result).toBe(true);
    });
  });
});
