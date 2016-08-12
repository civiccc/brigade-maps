/* global describe it beforeEach */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const temp = require('temp');

const buildConfig = require('../lib/buildConfig');

describe('buildConfig', function() {
  beforeEach(() => {
    temp.track();

    this.tempdir = temp.mkdirSync('maps-buildConfig-moveToOCDID');
    this.buildConfig = buildConfig({ buildPath: this.tempdir });
  });

  describe('moveToOCDID', () => {
    it('moves a file correctly', () => {
      const testTilePath = path.join(this.tempdir, 'testTile.txt');
      const expectedDestination =
        path.join(this.tempdir, 'ocd-division', 'foo:1', 'bar:1', 'federal.txt');

      fs.writeFileSync(testTilePath, 'foo');

      this.buildConfig.moveToOCDID(testTilePath, 'ocd-division/foo:1/bar:1', 'federal');

      assert.equal(fs.readFileSync(expectedDestination), 'foo');
    });
  });
});
