//
// Simple web server that allows happo to request the images at run-time. This
// allows us to use the javascript API more cleanly rather than having to dive
// down into the actual visual diffing logic.
//
'use strict';

const fs = require('fs');

const express = require('express');

const app = express();
const renderTile = require('../../renderAll.js').renderTile;

const tilesByOcdid = {};

for (const tile of JSON.parse(fs.readFileSync('build/tiles.json'))) {
  tilesByOcdid[tile.ocdid] = tile;
}

app.get(/\/render\/(.*)/, (req, res) => {
  const ocdid = req.params[0];
  const tile = tilesByOcdid[ocdid];
  if (!tile) {
    return res.status(404).send('Could not find tile for OCDID: ' + ocdid);
  }

  renderTile(tile);

  res.sendFile(ocdid + '/' + tile.level + '.png', { root: 'build/' });
});

app.listen(6075); // 6075 is the GEOID of San Francisco County
