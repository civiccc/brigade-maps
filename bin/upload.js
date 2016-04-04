var async = require('async');
var cloudinary = require('cloudinary');
var fs = require('fs');
var path = require('path');

var uploadQueue = async.queue(
  function(tile, callback) {
    console.log('uploading ' + tile.ocdid + '/' + tile.level);
    var tilePath = path.join('build', tile.ocdid, tile.level + '.png');
    cloudinary.uploader.upload(
      tilePath,
      function(result) {
        if (result.public_id == undefined) {
          console.log("Failed to upload tile " + tilePath + " : " + result)
        } else {
          console.log('uploaded ' + tile.ocdid + '/' + tile.level);
        }
        callback();
      },
      {
        public_id: tile.ocdid + '/' + tile.level,
        tags: ['district', 'district-' + tile.level]
      }
    );
  },
  20 // max concurrent jobs
)

var tiles = JSON.parse(fs.readFileSync('build/tiles.json'));

tiles.forEach(function(tile) {
  if (tile.ocdid == undefined) { return }
  uploadQueue.push(tile);
});
