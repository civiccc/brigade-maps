#!/usr/bin/env node
'use strict';

const renderGeoJSON = require('../renderGeoJSON');
const renderAll = require('../renderAll.js').renderAll;
const filterTile = process.argv[2];

renderGeoJSON(filterTile);
renderAll(filterTile);
