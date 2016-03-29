#!/usr/bin/env node
var renderAll = require('../renderAll.js').renderAll

var filterTile = process.argv[2];

renderAll(filterTile)
