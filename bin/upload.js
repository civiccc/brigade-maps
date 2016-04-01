var cloudinary = require('cloudinary');
var fs = require('fs');
var path = require('path');

var tiles = JSON.parse(fs.readFileSync('build/tiles.json'));

tiles.forEach(function(tile) {
  var tilePath = path.join('build', tile.ocdid, 'map.png');
  console.log('uploading ' + tile.ocdid);

  var q = cloudinary.uploader.upload(
    tilePath,
    function(result) { console.log('uploaded ' + tile.ocdid) },
    {
      public_id: tile.ocdid + '/map',
      tags: ['district']
    }
  );
});
