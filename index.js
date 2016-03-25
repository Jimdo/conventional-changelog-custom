'use strict';

const extend = require('extend');
const angularChangelogPromise = require('conventional-changelog-angular');
const lib = require('./lib');

module.exports = Promise.all([
  lib.getConfigFromRcFile(),
  angularChangelogPromise,
]).then((args) => extend(
  true,
  {},
  args[1],
  { writerOpts: { transform: lib.getTransformFn(args[0]) } }
));
