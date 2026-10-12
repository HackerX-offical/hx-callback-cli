import { headersToRecord } from './headers-to-record.js';

describe('headersToRecord', () => {
  it('keeps string headers', () => {
    expect(headersToRecord({ 'x-test': '1', host: 'a' })).toEqual({ 'x-test': '1', host: 'a' });
  });
});
