'use strict';

const getConfigFromRcFile = require('./getConfigFromRcFile');

module.exports = getConfigFromRcFile().then((config) => {
  return {
    writerOpts: {
      transform(commit) {
        config.types.forEach((type) => {
          if (type.key === commit.type) {
            commit.type = type.name;
          }
        });
        return commit;
      },
    },
  };
});
