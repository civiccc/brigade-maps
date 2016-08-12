'use strict';

/* global desc task file complete jake */
const temp = require('temp');

temp.track(); // automatically cleanup temp dirs on exit

desc('Render all maps');
task('render', ['shapefiles', 'renderAll.js', 'build/tiles.json', 'renderGeoJSON.js'], () => {
  const renderGeoJSON = require('./renderGeoJSON.js');
  const renderAll = require('./renderAll.js').renderAll;
  const filterTile = process.env.only;

  renderGeoJSON(filterTile);
  renderAll(filterTile);
});

desc('Build list of tiles to render');
file('build/tiles.json', ['generateBuildConfig.js', 'config/maps.json'], { async: true }, () => {
  jake.exec([
    'mkdir -p build',
    'node generateBuildConfig.js',
  ], { printStdout: true, printStderr: true }, () => {
    complete();
  });
});

file('config/114_congress/ocdid_mapping.csv',
  ['config/114_congress/generateOcdidMapping.js', 'data/fips.csv'], { async: true }, () => {
    jake.exec([
      `bash -c "node config/114_congress/generateOcdidMapping.js >
        config/114_congress/ocdid_mapping.csv"`
    ], { printStdout: true, printStderr: true }, () => {
      complete();
    });
  });

desc('render california');
task('california', ['shapefiles', 'renderAll.js', 'build/tiles.json'], { async: true }, () => {
  jake.exec([
    'node bin/renderAll.js /06',
  ], { printStdout: true, printStderr: true }, () => {
    complete();
  });
});

task('shapefiles', [
  'shapefiles/114_congress',
  'shapefiles/usa_states',
  'shapefiles/countries',
  'shapefiles/sldl',
  'shapefiles/sldu',
]);

desc('clean up build residuals');
task('clean', () => {
  jake.rmRf('build/*');
});

file('shapefiles/114_congress', { async: true }, () => {
  const tempdir = temp.mkdirSync('maps');

  jake.exec([
    'bash -c "wget -O- ftp://rockyftp.cr.usgs.gov/vdelivery/Datasets/Staged/SmallScale/Data/Boundaries/cgd114p010g.shp.tar.gz ' +
      '| tar xz -C ' + tempdir + '"',
    'mv ' + tempdir + ' shapefiles/114_congress',
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/usa_states', { async: true }, () => {
  const tempdir = temp.mkdirSync('maps');

  jake.exec([
    'bash -c "wget -O- http://dds.cr.usgs.gov/pub/data/nationalatlas/statesp010g.shp_nt00938.tar.gz ' +
      '| tar xz -C ' + tempdir + '"',
    'mv ' + tempdir + ' shapefiles/usa_states',
  ], { printStdout: true, printStderr: true }, complete);
});

// This data set is in the public domain:
file('shapefiles/countries', { async: true }, () => {
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "cd ' + tempdir + ' && ' +
      'wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip && ' +
      'unzip ne_10m_admin_0_countries.zip && ' +
      'rm ne_10m_admin_0_countries.zip"',
    'mv ' + tempdir + ' shapefiles/countries'
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/sldl', { async: true }, () => {
  // This takes several minutes; you may be better off downloading with a real
  // ftp client
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/SLDL && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'mv ' + tempdir + ' shapefiles/sldl'
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/sldl', { async: true }, () => {
  // This takes several minutes; you may be better off downloading with a real
  // ftp client
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/SLDL && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'mv ' + tempdir + ' shapefiles/sldl'
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/sldu', { async: true }, () => {
  // This takes several minutes; you may be better off downloading with a real
  // ftp client
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/SLDU && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'mv ' + tempdir + ' shapefiles/sldl'
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/place', { async: true }, () => {
  // This takes several minutes; you may be better off downloading with a real
  // ftp client
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/PLACE && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'mv ' + tempdir + ' shapefiles/place'
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/county', { async: true }, () => {
  // This takes several minutes; you may be better off downloading with a real
  // ftp client
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/COUNTY && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'mv ' + tempdir + ' shapefiles/county'
  ], { printStdout: true, printStderr: true }, complete);
});

// County Subdivisions: some OCD "places" / incorporated towns are represented
// in the census datasets as "County Subdivisions":
// https://www.census.gov/geo/reference/gtc/gtc_cousub.html
file('shapefiles/cousub', { async: true }, () => {
  // This takes several minutes; you may be better off downloading with a real
  // ftp client
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/COUSUB && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'mv ' + tempdir + ' shapefiles/cousub'
  ], { printStdout: true, printStderr: true }, complete);
});
