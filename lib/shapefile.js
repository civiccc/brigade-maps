var mapnik = require('mapnik');

exports.listFeatures = function(shapefile) {
  mapnik.register_default_input_plugins();

  var ds = new mapnik.Datasource({ type: 'shape', file: shapefile });
  var fs = ds.featureset();
  var features = [];
 
  if (fs) {
    var feat = fs.next();

    while (feat) {
      var attrs = feat.attributes()
      features.push(attrs)

      feat = fs.next();
    }
  }

  return features
};
