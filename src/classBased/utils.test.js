/* eslint-disable */
import Utils from './utils';

describe('Testing breakXPath helper function', () => {
  const testCases = [{
    value: './.class/#id',
    result: ['.', '.class', '#id']
  }, {
    value: './.class//#id',
    result: ['.', '.class', '#id']
  }, {
    value: '',
    result: []
  }];

  for (let i = 0; i < testCases.length; i++) {
    test(`${testCases[i].value} should be` +
         `${JSON.stringify(testCases[i].result)}`, () => {
      expect(Utils.breakXPath(testCases[i].value)).toEqual(testCases[i].result);
    });
  }
});
