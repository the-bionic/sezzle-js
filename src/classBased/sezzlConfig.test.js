/* eslint-disable no-undef */
import SezzleConfig from './sezzleConfig';

const cloneDeep = require('lodash.clonedeep');
const sezzleConfig = require('../sezzle.config.js');


const sezzleConfigInstance = SezzleConfig();

describe('Backwards compatability function works as expected', () => {
  test('Properly converts old config structure to new config structure', () => {
    // deep object comparison
    expect(sezzleConfig.newConfig).toEqual(makeCompatible(sezzleConfig.oldConfig));
  });
});
