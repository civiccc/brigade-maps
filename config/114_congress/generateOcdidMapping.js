var parse = require('csv-parse/lib/sync');
var listShapefileFeatures = require('../../lib/shapefile').listFeatures;
var fs = require('fs');

var fipsCodes = parse(fs.readFileSync('data/fips.csv'), { comment: '#' });
var stateByCode = {};
for (code of fipsCodes) {
  stateByCode[code[2]] = { name: code[0], abbreviation: code[1] };
}

for (feature of listShapefileFeatures('shapefiles/114_congress/cgd114p010g.shp')) {
  var state = stateByCode[feature.STATE_FIPS];
  var ocdid = 'ocd-division/state:' + state.abbreviation.toLowerCase() + '/cd:' + parseInt(feature.CONG_DIST);
  console.log([feature.STATE_FIPS, feature.CONG_DIST, ocdid].join(','));
}
