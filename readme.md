conventional-changelog-custom
=============================

[![Build Status](https://travis-ci.org/Jimdo/conventional-changelog-custom.svg?branch=master)](https://travis-ci.org/Jimdo/conventional-changelog-custom)
[![Coverage Status](https://coveralls.io/repos/github/Jimdo/conventional-changelog-custom/badge.svg?branch=master)](https://coveralls.io/github/Jimdo/conventional-changelog-custom?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/Jimdo/conventional-changelog-custom/badges/score.svg)](https://www.bithound.io/github/Jimdo/conventional-changelog-custom)
[![bitHound Dependencies](https://www.bithound.io/github/Jimdo/conventional-changelog-custom/badges/dependencies.svg)](https://www.bithound.io/github/Jimdo/conventional-changelog-custom/master/dependencies/npm)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


customizable conventional changelog preset


Install
-------

`npm install conventional-changelog-custom`


Use
---

```js
const conventionalChangelog = require('conventional-changelog');
const config = require('conventional-changelog-custom');

conventionalChangelog({
  config,
  /* ... */
}).pipe(process.stdout); // or any writable stream
```

Configuration
-------------

this custom config will search for a `.changelogrc` file 
in any of the parent directories and use it's.

See the .changelogrc spec for details


License
-------

> The MIT License
> 
> Copyright (C) 2016 Jimdo GmbH
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
