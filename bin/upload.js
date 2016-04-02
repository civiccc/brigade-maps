var cloudinary = require('cloudinary');
var fs = require('fs');
var path = require('path');

var tiles = JSON.parse(fs.readFileSync('build/tiles.json'));

tiles.forEach(function(tile) {
  var tilePath = path.join('build', tile.ocdid, tile.level + '.png');
  console.log('uploading ' + tile.ocdid + '/' + tile.level);

  cloudinary.uploader.upload(
    tilePath,
    function(result) {},
    {
      public_id: tile.ocdid + '/' + tile.level,
      tags: ['district', 'district-' + tile.level]
    }
  );
});
