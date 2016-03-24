var mapnik = require('mapnik');
var fs = require('fs');
var swig  = require('swig');

var filterTile = process.argv[2];

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var renderTile = function(configDirectory, extent) {
  console.log("Rendering " + configDirectory + "/map.png")

  var map = new mapnik.Map(512, 512);
  map.fromStringSync(fs.readFileSync(configDirectory + '/stylesheet.xml').toString())

  // var margin = 0.4;
  var xdiff = extent[2] - extent[0];
  var ydiff = extent[3] - extent[1];

  extent[0] -= xdiff * 0.1
  extent[1] -= ydiff * 0.1
  extent[2] += xdiff * 0.1
  extent[3] += ydiff * 0.1

  map.zoomToBox(extent[0], extent[1], extent[2], extent[3]);
  map.renderFileSync(configDirectory + '.png')
  map.clear()
}

var tiles = JSON.parse(fs.readFileSync('build/config/tiles.json'))
tiles.forEach(function(tile) {
  if (filterTile && tile['configDir'].indexOf(filterTile) === -1) {
    return
  }

  renderTile(tile['configDir'], tile['extent'])
});
