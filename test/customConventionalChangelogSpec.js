'use strict';

const proxyquire = require('proxyquire');
const conventionalChangelogParser = require('conventional-commits-parser').sync;

describe('custom conventional changelog', () => {
  let customConventionalChangelog = null;
  let getConfigFromRcFileFake = null;
  let resolveConfigPromise = null;
  let defaultConfigFake = null;

  beforeEach(() => {
    defaultConfigFake = { notes: [], types: [] };
    getConfigFromRcFileFake = jasmine.createSpy('getConfigFromRcFile');
    getConfigFromRcFileFake.and.returnValue(new Promise((resolve) => {
      resolveConfigPromise = resolve;
    }));

    customConventionalChangelog = proxyquire('../lib/index', {
      './getConfigFromRcFile': getConfigFromRcFileFake,
      './defaultConfig': defaultConfigFake,
    });
  });

  it('returns a promise resolving to an option object', (done) => {
    customConventionalChangelog.then((options) => {
      expect(typeof options).toBe('object');
      done();
    }).catch(done.fail);

    resolveConfigPromise({});
  });

  function transformCommitWithConfig(commit, config, parserConfig) {
    const parsedCommit = conventionalChangelogParser(commit, parserConfig || {});

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

    it('falls back to defaultConfig', (done) => {
      defaultConfigFake.types.push({
        key: 'hase',
        name: 'Fuchs',
      });
      transformCommitWithConfig('hase(igel): lorem', {})
        .then((transformedCommit) => {
          expect(transformedCommit.type).toBe('Fuchs');
          done();
        }).catch(done.fail);
    });

    it('normalizes a wildcard scope', (done) => {
      transformCommitWithConfig('bar(*): lorem', { types: [{ key: 'bar' }] })
        .then((transformedCommit) => {
          expect(transformedCommit.scope).toBe('');
          done();
        }).catch(done.fail);
    });

    it('shortens the commit hash', (done) => {
      const someCommit = 'bar(*): lorem\n-hash-\nda4451bc8882f52c467068e414f9323ca34c6928';
      transformCommitWithConfig(someCommit, { types: [{ key: 'bar' }] })
        .then((transformedCommit) => {
          expect(transformedCommit.hash).toBe('da4451b');
          done();
        }).catch(done.fail);
    });

    it('shortens the subject', (done) => {
      const longSubject = 'foofoofoofoofoofoofoofoofoofoofoofoofoo' +
        'foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo';
      const someCommit = `bar(yep): ${longSubject}`;

      transformCommitWithConfig(someCommit, { types: [{ key: 'bar' }] })
        .then((transformedCommit) => {
          expect(transformedCommit.subject.length).toBe(80);
          done();
        }).catch(done.fail);
    });

    it('shortens the subject according to config', (done) => {
      const longSubject = 'foofoofoofoofoofoofoofoofoofoofoofoofoo' +
        'foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo';
      const someCommit = `bar(yep): ${longSubject}`;

      transformCommitWithConfig(someCommit, {
        types: [{ key: 'bar' }],
        maxSubjectLength: 42,
      }).then((transformedCommit) => {
        expect(transformedCommit.subject.length).toBe(42);
        done();
      }).catch(done.fail);
    });

    describe('notes', () => {
      it('does not discard commits containing important notes', (done) => {
        const commit = 'foo(b): hello\nIMPORTANT: be cool!\nSome Note: foo';

        transformCommitWithConfig(commit, {
          types: [{ key: 'a' }],
          notes: [
            { keyword: 'Some Note' },
            { keyword: 'IMPORTANT', important: true },
          ],
        }, { noteKeywords: ['IMPORTANT', 'Some Note'] }).then((transformedCommit) => {
          expect(transformedCommit).toBeDefined();
          done();
        }).catch(done.fail);
      });
    });
  });
});
