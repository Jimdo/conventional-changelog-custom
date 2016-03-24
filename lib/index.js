'use strict';

const getConfigFromRcFile = require('./getConfigFromRcFile');

module.exports = getConfigFromRcFile().then((config) => {
  const importantNoteKeywords = (config.notes || [])
    .filter((note) => note.important)
    .map((note) => note.keyword);

  function hasImportantNote(commit) {
    return commit.notes.reduce(
        (hadImportant, note) => {
          if (hadImportant) {
            return true;
          }

          return importantNoteKeywords.indexOf(note.title) !== -1;
        },
        false
    );
  }

  return {
    writerOpts: {
      transform(commit) {
        const isImportant = hasImportantNote(commit);
        const typeConfig = config.types.reduce((theType, aType) => {
          if (!theType && aType.key === commit.type) {
            return aType;
          }

          return theType;
        }, isImportant ? {} : undefined);

        if (!typeConfig) {
          return undefined;
        }

        if (!isImportant && typeConfig.hide) {
          return undefined;
        }

        return Object.assign({}, commit, {
          type: typeConfig.name || commit.type,
        });
      },
    },
  };
});
