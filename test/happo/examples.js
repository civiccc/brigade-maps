/* global happo */
'use strict';

const renderMap = (ocdid) => {
  return new Promise(resolve => {
    const elem = document.createElement('img');
    elem.setAttribute('src', 'http://' + window.location.hostname + ':6075/render/' + ocdid);
    elem.onload = () => resolve(elem);

    document.body.appendChild(elem);
  });
};

happo.define('california', function() {
  return renderMap('ocd-division/country:us/state:ca');
});

happo.define('san francisco', function() {
  return renderMap('ocd-division/country:us/state:ca/county:san_francisco');
});
