'use strict';

/* global desc task file complete jake */
const temp = require('temp');
const path = require('path');
const execSync = require('child_process').execSync;

temp.track(); // automatically cleanup temp dirs on exit

desc('Render all maps');
task('render', ['shapefiles', 'renderAll.js', 'build/tiles.json', 'renderGeoJSON.js'], () => {
  const renderGeoJSON = require('./renderGeoJSON.js');
  const renderAll = require('./renderAll.js').renderAll;
  const filterOcdid = process.env.only;

  if (filterOcdid) {
    console.log('Filtering render to ONLY: ', filterOcdid);
  }

  renderGeoJSON(filterOcdid);
  renderAll(filterOcdid);
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

desc('package and upload GeoJSON files to S3');
task('package-geojson', [], () => {
  let tarBinary = 'tar';

  execSync('tar --version', (err, stdout) => {
    if (err !== undefined) {
      console.log('Failed to call `tar` executable!');
    }

    if (stdout.indexOf('GNU tar') !== -1) {
      // all's good in the hood!
      return;
    }

    execSync('gtar --version', (err2) => {
      if (err2 !== undefined) {
        console.log('ERROR: You will need to install GNU tar for this upload to work.');
        console.log('');
        console.log('Run `brew install gnu-tar`.');
      } else {
        tarBinary = 'gtar';
      }
    });
  });

  jake.exec([
    `bash -c "cd build/; find ocd-division -name geojson.json | \
      ${tarBinary} -T- --transform='s/\\/geojson\\.json$/.json/' -czf tmp-geojson.tar.gz"`
  ], { printStdout: true, printStderr: true }, () => {
    console.log('Successfully output to build/tmp-geojson.tar.gz.');
    console.log('');
    console.log('You can now manually upload this to S3 with the AWS-CLI like:');
    console.log('');
    console.log('  aws s3 cp build/tmp-geojson.tar.gz s3://brigade-development/geojson-districts.tar.gz --acl=public-read');
    console.log('');
    console.log('(if you do not have aws-cli, you can install it with `pip install aws-cli`)');

    complete();
  });
});

task('shapefiles', [
  'shapefiles/114_congress',
  'shapefiles/usa_states',
  'shapefiles/usa_states_land',
  'shapefiles/countries',
  'shapefiles/sldl_land',
  'shapefiles/sldu_land',
  'shapefiles/county',
  'shapefiles/county_land',
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

file('shapefiles/usa_states_land', ['shapefiles/usa_states'], { async: true }, () => {
  const tempdir = temp.mkdirSync('maps');
  jake.exec([
    'bash -c "$(npm bin)/mapshaper -i shapefiles/usa_states/statesp010g.shp ' +
      '-filter \'TYPE == \\"Land\\"\' -o ' + tempdir + '"',
    'mv ' + tempdir + ' shapefiles/usa_states_land',
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

file('shapefiles/sldl_land', ['shapefiles/usa_states_land'], { async: true }, () => {
  const tempdir = temp.mkdirSync('maps');
  const landShapefile = path.resolve('shapefiles/usa_states_land/statesp010g.shp');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/SLDL && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'bash -c "cd ' + tempdir + ' && for FILE in *.shp; do ' +
        `$(npm bin)/mapshaper -i \\$FILE -clip ${landShapefile} remove-slivers -o force \\$FILE;` +
      'done"',
    'mv ' + tempdir + ' shapefiles/sldl_land'
  ], { printStdout: true, printStderr: true }, complete);
});

file('shapefiles/sldu_land', { async: true }, () => {
  const tempdir = temp.mkdirSync('maps');
  const landShapefile = path.resolve('shapefiles/usa_states_land/statesp010g.shp');
  jake.exec([
    'bash -c "' +
      'cd ' + tempdir + ' && ' +
      'wget -r -nH --cut-dirs=4 -nc ftp://ftp2.census.gov/geo/tiger/TIGER2014/SLDU && ' +
      'unzip ./\*.zip && ' +
      'rm ./*.zip"',
    'bash -c "cd ' + tempdir + ' && for FILE in *.shp; do ' +
        `$(npm bin)/mapshaper -i \\$FILE -clip ${landShapefile} remove-slivers -o force \\$FILE;` +
      'done"',
    'mv ' + tempdir + ' shapefiles/sldu_land'
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

file('shapefiles/county_land',
  ['shapefiles/county', 'shapefiles/usa_states_land'], { async: true }, () => {
    const tempdir = temp.mkdirSync('maps');
    jake.exec([
      'bash -c "$(npm bin)/mapshaper -i shapefiles/county/tl_2014_us_county.shp ' +
        '-clip shapefiles/usa_states_land/statesp010g.shp remove-slivers -o ' + tempdir + '"',
      'mv ' + tempdir + ' shapefiles/county_land',
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
