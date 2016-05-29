var parse = require('csv-parse/lib/sync');
var listShapefileFeatures = require('../../lib/shapefile').listFeatures;
var fs = require('fs');
var glob = require('glob');

var fipsCodes = parse(fs.readFileSync('data/fips.csv'), { comment: '#' });

var stateByCode = {};
for (code of fipsCodes) {
  stateByCode[code[2]] = { name: code[0], abbreviation: code[1] };
}


var ocdCsv = parse(fs.readFileSync('data/us_census_places.csv'), { comment: '#' });
var ocdidByGeoId = {};
for (row of ocdCsv) {
  var ocdid = row[0];
  var census_geoid = row[2].slice(6); // chop off leading "place-"
  ocdidByGeoId[census_geoid] = ocdid;
}


var shapefiles = glob.sync('shapefiles/place/*.shp');

for (shapefile of shapefiles) {
  for (feature of listShapefileFeatures(shapefile)) {
    var geoId = feature.GEOID;
    var ocdid = ocdidByGeoId[geoId];
    if (ocdid) {
      console.log([feature.GEOID, ocdid].join(','));
    }
  }
}
