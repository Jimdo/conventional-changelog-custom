'use strict';

const getConfigFromRcFile = require('./getConfigFromRcFile');

module.exports = getConfigFromRcFile().then((config) => {
  return {
    writerOpts: {
      transform(commit) {
        const typeConfig = config.types.reduce((theType, aType) => {
          if (!theType && aType.key === commit.type) {
            return aType;
          }

          return theType;
        }, undefined);

        if (!typeConfig) {
          return undefined;
        }

        if (typeConfig.hide) {
          return undefined;
        }

        return Object.assign({}, commit, {
          type: typeConfig.name,
        });
      },
    },
  };
});
