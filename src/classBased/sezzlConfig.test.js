/* eslint-disable */
import SezzleConfig from './sezzleConfig';
import Utils from './utils';
const cloneDeep = require('lodash.clonedeep');

const sezzleConfig = require('../sezzle.config.js');

// TODO: describe('Backwards compatability function works as expected', () => {
//   test('Properly converts old config structure to new config structure', () => {
//     // deep object comparison
//     const sezzleConfigInst = new SezzleConfig(sezzleConfig.oldConfig).init();
//     console.log('received', sezzleConfigInst.configGroups);
//     console.log('sezzle-config', sezzleConfig.newConfig.configGroups);
//     expect(sezzleConfig.newConfig.configGroups).toEqual(sezzleConfigInst.configGroups);
//   });
// });

describe('Config validator function works as expected', () => {
  test('Throws an error when configGroups is not an array', () => {
    const newConfig = cloneDeep(sezzleConfig.newConfig);
    newConfig.configGroups = 'somethingWhichIsNotAnArray';

    expect(() => {
      new SezzleConfig(newConfig).init();
    }).toThrow('options.configGroups is not an array');
  });

  test('Throws an error when configGroups is an empty array', () => {
    const newConfig = cloneDeep(sezzleConfig.newConfig);
    newConfig.configGroups = [];

    expect(() => {
      new SezzleConfig(newConfig).init();
    }).toThrow('options.configGroups must have at least one config object');
  });

  test('Throws an error when targetXPath is not specified in any one of the config groups', () => {
    const newConfig = cloneDeep(sezzleConfig.newConfig);
    delete newConfig.configGroups[0].targetXPath;

    expect(() => {
      new SezzleConfig(newConfig).init();
    }).toThrow('targetXPath must be specified in all configs in options.configGroups');
  });

  test('Throws an error when targetXPath is not a string in any one of the config groups', () => {
    const newConfig = cloneDeep(sezzleConfig.newConfig);
    newConfig.configGroups[0].targetXPath = [newConfig.configGroups[0].targetXPath];

    expect(() => {
      new SezzleConfig(newConfig).init();
    }).toThrow('targetXPath must be of type string');
  });

  test('Throws an error when renderToPath is not a string in any one of the config groups', () => {
    const newConfig = cloneDeep(sezzleConfig.newConfig);
    newConfig.configGroups[0].renderToPath = [newConfig.configGroups[0].renderToPath];

    expect(() => {
      new SezzleConfig(newConfig).init();
    }).toThrow('renderToPath must be of type string');
  });

  test('Throws an error when a property which does not belong to a config group is being defined in a config group', () => {
    const newConfig = cloneDeep(sezzleConfig.newConfig);
    newConfig.configGroups[0].merchantID = 'someMerchantID';

    expect(() => {
      new SezzleConfig(newConfig).init();
    }).toThrow('merchantID is not a property of a configGroup. Specify this key at the outermost layer');
  });
});

describe('Constructor correctly sets the parameters', () => {
  test('Properly sets xpath value when there are multiple configs in the configGroups array', () => {
    const sz = new SezzleConfig(sezzleConfig.newConfig).init();
    for (var i = 0, len = sz.configGroups.length; i < len; i++) {
      expect(sz.configGroups[i].xpath).toEqual(
        Utils.breakXPath(sezzleConfig.newConfig.configGroups[i].targetXPath)
      );
    }
  });

  test('Properly sets rendertopath value when there are multiple configs in the configGroups array', () => {
    const sz = new SezzleConfig(sezzleConfig.newConfig).init();
    for (var i = 0, len = sz.configGroups.length; i < len; i++) {
      expect(sz.configGroups[i].rendertopath).toEqual(sezzleConfig.newConfig.configGroups[i].renderToPath);
    }
  });

  test(`Properly sets ignoredPriceElements ` +
    `value when options.configGroups[i].ignoredPriceElements is` +
    `a string`, () => {
      const newConfig = {
        ...sezzleConfig.newConfig,
        ...{
          ignoredPriceElements: '#id/.class'
        }
      };
      const sz = new SezzleConfig(newConfig).init();
      for (var i = 0, len = sz.configGroups[i].length; i < len; i++) {
        expect(sz.configGroups[i].ignoredPriceElements)
          .toEqual([['#id', '.class']]);
      }
    });

  test(`Properly sets ignoredPriceElements ` +
    `value when options.configGroups[i].ignoredPriceElements is` +
    `an array`, () => {
      const sz = new SezzleConfig(sezzleConfig.newConfig).init();
      for (var i = 0, len = sz.configGroups.length; i < len; i++) {
        expect(sz.configGroups[i].ignoredPriceElements)
          .toEqual([['#id-4', '.class-4'], ['#id-5', '.class-5']]);
      }
    });

  test(`Properly duplicates ignoredPriceElements ` +
    `value when old config is passed and options.ignoredPriceElements is` +
    `a string`, () => {
      const oldConfig = {
        ...sezzleConfig.oldConfig,
        ignoredPriceElements: '#id/.class'
      };
      const sz = new SezzleConfig(oldConfig).init();
      for (var i = 0, len = sz.configGroups[i].length; i < len; i++) {
        expect(sz.configGroups[i].ignoredPriceElements)
          .toEqual([['#id', '.class']]);
      }
    });

  test(`Properly duplicates ignoredPriceElements ` +
    `value when old config is passed and options.ignoredPriceElements is` +
    `an array`, () => {
      const sz = new SezzleConfig(sezzleConfig.oldConfig).init();
      for (var i = 0, len = sz.configGroups.length; i < len; i++) {
        expect(sz.configGroups[i].ignoredPriceElements)
          .toEqual([['#id-4', '.class-4'], ['#id-5', '.class-5']]);
      }
    });
});
