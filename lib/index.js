'use strict';

const getConfigFromRcFile = require('./getConfigFromRcFile');

module.exports = getConfigFromRcFile().then((config) => {
  return {
    writerOpts: {
      transform(commit) {
        return Object.assign({}, commit, {
          type: config.types.reduce((theType, aType) => {
            if (theType === commit.type &&
              aType.key === commit.type
            ) {
              return aType.name;
            }

            return theType;
          }, commit.type),
        });
      },
    },
  };
});
