import { pick } from '../src/util/util';

describe('Utility functions', () => {
  describe('pick', () => {
    it('should return new object with picked properties', () => {
      const original = {
        one: 'one',
        two: true,
        three: {
          one: 1,
          two: 2
        },
        four: 4
      };
      const result = {
        one: 'one',
        three: { one: 1, two: 2 }
      };
      expect(pick(original, ['one', 'three'])).toEqual(result);
    });
  });
});
