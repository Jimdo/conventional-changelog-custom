'use strict';

const extend = require('extend');
const defaultConfig = require('./defaultConfig');

module.exports = function getTransformFn(someConfig) {
    const config = extend(true, {}, defaultConfig, someConfig);

    const importantNoteKeywords = config.notes
        .filter(note => note.important)
        .map(note => note.keyword);

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

    function trimHash(commit) {
        if (typeof commit.hash === 'string') {
            return commit.hash.substring(0, 7);
        }

        return undefined;
    }

    return function transform(commit) {
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
            scope: commit.scope === '*' ? '' : commit.scope,
            hash: trimHash(commit),
            subject: commit.subject.substring(0, config.maxSubjectLength),
        });
    };
};
