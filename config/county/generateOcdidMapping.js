var parse = require('csv-parse/lib/sync');
var listShapefileFeatures = require('../../lib/shapefile').listFeatures;
var fs = require('fs');
var glob = require('glob');

var fipsCodes = parse(fs.readFileSync('data/fips.csv'), { comment: '#' })

var stateByCode = {};
for (code of fipsCodes) {
  stateByCode[code[2]] = { name: code[0], abbreviation: code[1] }
}


var ocdCsv = parse(fs.readFileSync('data/us_census_places.csv'), { comment: '#' })
var ocdidByGeoId = {}
for (row of ocdCsv) {
  var ocdid = row[0]
  var census_geoid = row[2].slice(6) // chop off leading "place-"
  ocdidByGeoId[census_geoid] = ocdid
}


var shapefiles = glob.sync('shapefiles/county/*.shp');

// We don't care about all entries;
// via https://www.census.gov/geo/reference/funcstat.html
//
// Including:
// 'A': Active government providing primary general-purpose functions
// 'B': Active government that is partially consolidated with another
//      government but with separate officials providing primary
//      general-purpose functions
// 'C': Active government consolidated with another government with a single
//      set of officials
// 'M': Active legal real property entity with quasi-legal functions
// 'T': Active state-recognized entity
//
// Not including:
// 'E': Active government providing special-purpose functions
// 'F': Fictitious entity created to fill the Census Bureau geographic
//      hierarchy
// 'G': Active government that is subordinate to another unit of government
// 'I': Inactive governmental unit that has the power to provide primary
//      special-purpose functions
// 'L': Inactive, nonfunctioning legal real property entity with potential
//      quasi-legal administrative functions
// 'N': Nonfunctioning legal entity
// 'S': Statistical entity
var validStatus = (funcstat) => ('ABCMT'.indexOf(funcstat) != -1)

for (shapefile of shapefiles) {
  for (feature of listShapefileFeatures(shapefile)) {
    if (!validStatus(feature.FUNCSTAT)) { continue }
    var geoId = feature.GEOID;
    var ocdid = ocdidByGeoId[geoId];

    // skip places without ocdid
    if (!ocdid) { continue }

    console.log([feature.GEOID, ocdid].join(','));
  }
}
