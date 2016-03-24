var mapnik = require('mapnik');
var fs = require('fs');
var swig  = require('swig');

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var map = new mapnik.Map(2560, 2560);

map.load('stylesheet.xml', function(err,map) {
  if (err) throw err;

  var margin = 0.3;

  map.zoomAll();
  // map.zoomToBox(extent[0] - margin, extent[1] - margin, extent[2] + margin, extent[3] + margin);

  var im = new mapnik.Image(2560, 2560);
  map.render(im, function(err,im) {
    if (err) throw err;

    im.encode('png', function(err,buffer) {
      if (err) throw err;

      fs.writeFile('map.png',buffer, function(err) {
        if (err) throw err;
        console.log('saved map image to map.png');
      });
    });
  });
});
