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

  function transformCommitWithConfig(commit, config) {
    const parsedCommit = conventionalChangelogParser(commit, {});

    resolveConfigPromise(config);

    return customConventionalChangelog
      .then((options) => options.writerOpts.transform(parsedCommit));
  }

  describe('writerOptions', () => {
    it('maps short notation of type to longer title', (done) => {
      transformCommitWithConfig('foo(asd): hello', {
        types: [
          {
            key: 'foo',
            name: 'Foo Fuchs',
          },
        ],
      }).then((transformedCommit) => {
        expect(transformedCommit.type).toBe('Foo Fuchs');
        done();
      }).catch(done.fail);
    });

    it('discards unknown commit types', (done) => {
      transformCommitWithConfig('a(c): c', { types: [{ key: 'b' }] })
        .then((transformedCommit) => {
          expect(transformedCommit).toBeUndefined();
          done();
        }).catch(done.fail);
    });

    it('uses type key, if type config does not specify a name', (done) => {
      transformCommitWithConfig('a(c): c', { types: [{ key: 'a' }] })
        .then((transformedCommit) => {
          expect(transformedCommit.type).toBe('a');
          done();
        }).catch(done.fail);
    });

    it('discards commits that are not meant to be shown in changelog', (done) => {
      transformCommitWithConfig('bar(fgh): lorem', {
        types: [
          {
            key: 'bar',
            hide: true,
          },
        ],
      }).then((transformedCommit) => {
        expect(transformedCommit).toBeUndefined();
        done();
      }).catch(done.fail);
    });
  });
});
