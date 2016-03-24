'use strict';

const proxyquire = require('proxyquire');
const conventionalChangelogParser = require('conventional-commits-parser').sync;

describe('custom conventional changelog', () => {
  let customConventionalChangelog = null;
  let getConfigFromRcFileFake = null;
  let resolveConfigPromise = null;

  beforeEach(() => {
    getConfigFromRcFileFake = jasmine.createSpy('getConfigFromRcFile');
    getConfigFromRcFileFake.and.returnValue(new Promise((resolve) => {
      resolveConfigPromise = resolve;
    }));

    customConventionalChangelog = proxyquire('../lib/index', {
      './getConfigFromRcFile': getConfigFromRcFileFake,
    });
  });

  it('returns a promise resolving to an option object', (done) => {
    customConventionalChangelog.then((options) => {
      expect(typeof options).toBe('object');
      done();
    }).catch(done.fail);

    resolveConfigPromise();
  });

  describe('writerOptions', () => {
    it('maps short notation of type to longer title', (done) => {
      const someCommit = conventionalChangelogParser('foo(asd): hello', {});
      const customConfig = {
        types: [
          {
            key: 'foo',
            name: 'Foo Fuchs',
          },
        ],
      };

      customConventionalChangelog.then((options) => {
        const transformedCommit = options.writerOpts.transform(someCommit);

        expect(transformedCommit.type).toBe('Foo Fuchs');
        done();
      }).catch(done.fail);

      resolveConfigPromise(customConfig);
    });
  });
});
