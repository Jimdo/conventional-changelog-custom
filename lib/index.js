'use strict';

const getConfigFromRcFile = require('./getConfigFromRcFile');

module.exports = getConfigFromRcFile().then((config) => {
  return {
    writerOpts: {
      transform(commit) {
        const typeConfig = config.types.reduce((theType, aType) => {
          if (!null && aType.key === commit.type) {
            return aType;
          }

          return theType;
        }, null);

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
