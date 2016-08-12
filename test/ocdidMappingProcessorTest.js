/* global describe it */
const assert = require('assert');

const ocdidMappingProcessor = require('../lib/ocdidMappingProcessor');

describe('ocdidMappingProcessor', function() {
  it('maps correctly', () => {
    const config = {
      render_each: ['PROP_ONE', 'PROP_TWO'],
    };

    ocdidMappingProcessor.generateOcdIdMaps('test_ocdid_mapping', config, 'test/fixtures');

    const calculatedOCDID = ocdidMappingProcessor.getTileOCDID(
      ['1', '1'], // render attributes (PROP_ONE and PROP_TWO)
      'test_ocdid_mapping'
    );

    assert.equal('ocd-division/foo:1/bar:1', calculatedOCDID);
  });
});
