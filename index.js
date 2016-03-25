'use strict';

const deepAssign = require('deep-assign');
const angularChangelogPromise = require('conventional-changelog-angular');
const lib = require('./lib');

module.exports = Promise.all([
  lib.getConfigFromRcFile(),
  angularChangelogPromise,
]).then((config, conventionalChangelogAngular) => deepAssign(
  {},
  conventionalChangelogAngular,
  { writerOpts: { transform: lib.getTransformFn(config) } }
));
