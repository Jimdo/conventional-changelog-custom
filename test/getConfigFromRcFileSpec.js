'use strict';

const proxyquire = require('proxyquire');

describe('getConfigFromRcFile', () => {
  let getConfigFromRcFile = null;
  let findupFake = null;
  let fsFake = null;

  beforeEach(() => {
    findupFake = jasmine.createSpy('findup');
    fsFake = jasmine.createSpyObj('fs', ['readFile']);

    getConfigFromRcFile = proxyquire('../lib/getConfigFromRcFile', {
      findup: findupFake,
      fs: fsFake,
    });
  });

  it('returns config object from .changelogrc', (done) => {
    const someConfig = { foo: 'bar' };
    const somePath = '/lorem/ipsum';

    getConfigFromRcFile().then((configFromRc) => {
      expect(configFromRc).toEqual(someConfig);
      done();
    }).catch(done.fail);

    findupFake.calls.argsFor(0)[2](null, somePath);

    expect(fsFake.readFile).toHaveBeenCalledWith(`${somePath}/.changelogrc`, jasmine.any(Function));

    fsFake.readFile.calls.argsFor(0)[1](null, new Buffer(JSON.stringify(someConfig)));
  });
});
