var mapnik = require('mapnik');
var fs = require('fs');
var swig  = require('swig');

var filterTile = process.argv[2];

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var renderTile = function(tile) {
  console.log("Rendering " + tile.name)

  var map = new mapnik.Map(512, 512);
  var xmlPath = tile.configDir + '/' + tile.name + '.xml'
  map.fromStringSync(fs.readFileSync(xmlPath).toString())

  // add a 10% margin around the district:
  var extent = tile.extent;
  var xdiff = extent[2] - extent[0];
  var ydiff = extent[3] - extent[1];
  extent[0] -= xdiff * 0.1
  extent[1] -= ydiff * 0.1
  extent[2] += xdiff * 0.1
  extent[3] += ydiff * 0.1

  map.zoomToBox(extent[0], extent[1], extent[2], extent[3]);
  map.renderFileSync(tile.configDir + '/' + tile.name + '.png')
  map.clear()
}

var tiles = JSON.parse(fs.readFileSync('build/tiles.json'))
tiles.forEach(function(tile) {
  if (filterTile && tile.name.indexOf(filterTile) === -1) {
    return
  }

  renderTile(tile)
});
