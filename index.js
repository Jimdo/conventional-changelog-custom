'use strict';

const lib = require('./lib');

module.exports = lib.getConfigFromRcFile()
  .then((config) => ({ writerOpts: { transform: lib.getTransformFn(config) } }));
