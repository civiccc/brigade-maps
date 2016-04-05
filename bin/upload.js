var async = require('async');
var cloudinary = require('cloudinary');
var fs = require('fs');
var path = require('path');

const MAX_CONCURRENCY = 40

// write csv header row
process.stdout.write("ocdid,level,version,public_id\n")

var uploadQueue = async.queue(
  function(tile, callback) {
    var tilePath = path.join('build', tile.ocdid, tile.level + '.png');
    cloudinary.uploader.upload(
      tilePath,
      function(result) {
        if (result.public_id == undefined) {
          process.stderr.write("Failed to upload tile " + tilePath)
          process.stderr.write(result)
        } else {
          process.stdout.write(`${tile.ocdid},${tile.level},${result.version},${result.public_id}\n`)
        }
        callback();
      },
      {
        public_id: tile.ocdid + '/' + tile.level,
        tags: ['district', 'district-' + tile.level]
      }
    );
  },
  MAX_CONCURRENCY
)

var tiles = JSON.parse(fs.readFileSync('build/tiles.json'));

tiles.forEach(function(tile) {
  if (tile.ocdid == undefined) { return }
  uploadQueue.push(tile);
});
