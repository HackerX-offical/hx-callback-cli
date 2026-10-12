import { truncateBody } from './truncate-body.js';

describe('truncateBody', () => {
  it('caps length', () => {
    expect(truncateBody('abcdef', 3)).toBe('abc');
  });
});
