'use strict';

const EPSILON = 0.0001;

/**
 * Rounds an arbitrarily-nested array of arrays of floating-point coordinates.
 * Each coordinate is rounded if its value changes less than 0.0001.
 * For example:
 *   23.45678000001 -> 23.45678
 *
 * @param {Array} coords Arbitrarily nested array of coordinates.
 * @return {Array} Same array structure, but rounded.
 */
const roundCoordinates = (coords) => {
  if (Array.isArray(coords[0])) {
    return coords.map(roundCoordinates);
  } else {
    const rounded = [];

    for (const coordinate of coords) {
      let roundable = false;

      for (let i = 0; i < 15; i++) {
        const multipliedCoordinate = coordinate * Math.pow(10, i);
        if (Math.abs(Math.round(multipliedCoordinate) - multipliedCoordinate) < EPSILON) {
          roundable = true;
          rounded.push(Math.round(multipliedCoordinate) / Math.pow(10, i));
          break;
        }
      }
      if (!roundable) {
        rounded.push(coordinate);
      }
    }

    return rounded;
  }
};

module.exports = roundCoordinates;
