'use strict';

const proxyquire = require('proxyquire');
const conventionalChangelogParser = require('conventional-commits-parser').sync;

describe('getTransformFn', () => {
  let getTransformFn = null;
  let defaultConfigFake = null;

  beforeEach(() => {
    defaultConfigFake = { notes: [], types: [], '@noCallThru': true };

    getTransformFn = proxyquire('../lib/getTransformFn', {
      './defaultConfig': defaultConfigFake,
    });
  });

  it('returns a transform function', () => {
    expect(typeof getTransformFn()).toBe('function');
  });

  function transformCommitWithConfig(commit, config, parserConfig) {
    const parsedCommit = conventionalChangelogParser(commit, parserConfig || {});

    return getTransformFn(config)(parsedCommit);
  }

  describe('writerOptions', () => {
    it('maps short notation of type to longer title', () => {
      const transformedCommit = transformCommitWithConfig('foo(asd): hello', {
        types: [
          {
            key: 'foo',
            name: 'Foo Fuchs',
          },
        ],
      });

      expect(transformedCommit.type).toBe('Foo Fuchs');
    });

    it('discards unknown commit types', () => {
      const transformedCommit = transformCommitWithConfig(
        'a(c): c',
        { types: [{ key: 'b' }] }
      );

      expect(transformedCommit).toBeUndefined();
    });

    it('uses type key, if type config does not specify a name', () => {
      const transformedCommit = transformCommitWithConfig(
        'a(c): c',
        { types: [{ key: 'a' }] }
      );

      expect(transformedCommit.type).toBe('a');
    });

    it('discards commits that are not meant to be shown in changelog', () => {
      const transformedCommit = transformCommitWithConfig(
        'bar(fgh): lorem',
        {
          types: [
            {
              key: 'bar',
              hide: true,
            },
          ],
        }
      );

      expect(transformedCommit).toBeUndefined();
    });

    it('falls back to defaultConfig', () => {
      defaultConfigFake.types.push({
        key: 'hase',
        name: 'Fuchs',
      });

      const transformedCommit = transformCommitWithConfig(
        'hase(igel): lorem',
        {}
      );

      expect(transformedCommit.type).toBe('Fuchs');
    });

    it('normalizes a wildcard scope', () => {
      const transformedCommit = transformCommitWithConfig(
        'bar(*): lorem',
        { types: [{ key: 'bar' }] }
      );

      expect(transformedCommit.scope).toBe('');
    });

    it('shortens the commit hash', () => {
      const someCommit = 'bar(*): lorem\n-hash-\nda4451bc8882f52c467068e414f9323ca34c6928';
      const transformedCommit = transformCommitWithConfig(
        someCommit,
        { types: [{ key: 'bar' }] }
      );

      expect(transformedCommit.hash).toBe('da4451b');
    });

    it('shortens the subject', () => {
      defaultConfigFake.maxSubjectLength = 70;
      const longSubject = 'foofoofoofoofoofoofoofoofoofoofoofoofoo' +
        'foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo';
      const someCommit = `bar(yep): ${longSubject}`;

      const transformedCommit = transformCommitWithConfig(
        someCommit,
        { types: [{ key: 'bar' }] }
      );

      expect(transformedCommit.subject.length).toBe(70);
    });

    it('shortens the subject according to config', () => {
      const longSubject = 'foofoofoofoofoofoofoofoofoofoofoofoofoo' +
        'foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo';
      const someCommit = `bar(yep): ${longSubject}`;

      const transformedCommit = transformCommitWithConfig(someCommit, {
        types: [{ key: 'bar' }],
        maxSubjectLength: 42,
      });

      expect(transformedCommit.subject.length).toBe(42);
    });

    describe('notes', () => {
      it('does not discard commits containing important notes', () => {
        const commit = 'foo(b): hello\nIMPORTANT: be cool!\nSome Note: foo';

        const transformedCommit = transformCommitWithConfig(
          commit,
          {
            types: [{ key: 'a' }],
            notes: [
              { keyword: 'Some Note' },
              { keyword: 'IMPORTANT', important: true },
            ],
          },
          {
            noteKeywords: ['IMPORTANT', 'Some Note'],
          }
        );

        expect(transformedCommit).toBeDefined();
      });
    });
  });
});
