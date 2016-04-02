var parse = require('csv-parse/lib/sync');
var listShapefileFeatures = require('../../lib/shapefile').listFeatures;
var fs = require('fs');
var glob = require('glob');

var fipsCodes = parse(fs.readFileSync('data/fips.csv'), { comment: '#' })

var stateByCode = {};
for (code of fipsCodes) {
  stateByCode[code[2]] = { name: code[0], abbreviation: code[1] }
}

var sldstCodes = parse(fs.readFileSync('data/sldl.csv'), { comment: '#' })
var ocdidBySLDLST = {}
for (row of sldstCodes) {
  ocdidBySLDLST[row[1].slice(5)] = row[0]
}


var shapefiles = glob.sync('shapefiles/sldl/*.shp');

for (shapefile of shapefiles) {
  for (feature of listShapefileFeatures(shapefile)) {
    var geoid = feature.GEOID;
    var ocdid = ocdidBySLDLST[geoid];
    if (ocdid) {
      console.log([feature.GEOID, ocdid].join(','));
    }
  }
}
