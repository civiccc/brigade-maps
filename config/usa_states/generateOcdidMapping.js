var parse = require('csv-parse/lib/sync');
var fs = require('fs');

var fipsCodes = parse(fs.readFileSync('../../data/fips.csv'), { comment: '#' })
for (code of fipsCodes) {
  var abbr = code[1]
  var fipsCode = code[2]
  var ocdid = 'ocd-division/country:us/state:' + abbr.toLowerCase();
  if (abbr === '') { continue }
  console.log([fipsCode, ocdid].join(','))
}
