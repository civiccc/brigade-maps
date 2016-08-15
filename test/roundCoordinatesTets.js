/* global describe it */
'use strict';

const assert = require('assert');

const roundCoordinates = require('../lib/roundCoordinates');

describe('roundCoordinates', () => {
  it('rounds an array of coordinates correctly', () => {
    assert.deepEqual(
      roundCoordinates(
        // the array nesting structure is arbitrary
        [[[1.002000001], // rounds to 1.0002
          [[1.020001, 1.020002]] // the first one rounds, but not the second
        ]]),

      [[[1.002], [[1.02, 1.020002]]]]
    );
  });
});
