var mapnik = require('mapnik');
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var execSync = require('child_process').execSync;

const TILESIZE = 512;

var merc = new mapnik.Projection('+init=epsg:3857')

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var moveToOCDID = function(tilePath, ocdid, level) {
  var buildPath = 'build/'

  for (part of ocdid.split('/')) {
    buildPath = path.join(buildPath, part)
    if (!fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath)
    }
  }

  var outPath = path.join(buildPath, level + path.extname(tilePath))
  fs.renameSync(tilePath, outPath)
  return outPath
}

// Add some padding around a highlighted feature
// extent coords are in the form [minx, miny, maxx, maxy]
// or, roughly, (lower-left, top-right)
var padExtent = function(extent) {
  var xdiff = extent[2] - extent[0];
  var ydiff = extent[3] - extent[1];
  return [
    extent[0] - xdiff * 0.1,
    extent[1] - ydiff * 0.1,
    extent[2] + xdiff * 0.1,
    extent[3] + ydiff * 0.1
  ]
}

var renderTile = function(tile) {
  // skip rendering tiles without an OCDID, as they won't be visible
  // in the product and this avoids rendering ~10K tiles
  if (tile.ocdid == undefined) { return; }

  console.log("Rendering " + tile.xmlPath)

  var map = new mapnik.Map(TILESIZE, TILESIZE);
  var xmlPath = tile.xmlPath;
  var outPath = path.normalize(path.join(xmlPath, '..', path.basename(xmlPath, '.xml') + '.png'))
  map.fromStringSync(fs.readFileSync(xmlPath).toString())

  var extent = tile.extent;
  extent = padExtent(extent)    // add padding around highlighted feature
  extent = merc.forward(extent) // convert to Web Mercator coords
  map.zoomToBox(extent)

  map.renderFileSync(outPath)

  outPath = moveToOCDID(outPath, tile.ocdid, tile.level)

  // apply 'water' background color
  execSync(
    `gm convert ${outPath} -background '#d3ddff' -extent 0x0 ${outPath}`,
    function(error, stdout, stderr) {
      if (error != undefined) {
        console.log(`Failed to set background on ${outPath}`);
        console.log(error)
        console.log(stderr)
      }
    }
  );
}
exports.renderTile = renderTile

exports.renderAll = function(filterTile) {
  var tiles = JSON.parse(fs.readFileSync('build/tiles.json'))
  tiles.forEach(function(tile) {
    if (filterTile && tile.xmlPath.indexOf(filterTile) === -1) {
      return
    }

    renderTile(tile)
  });
}
