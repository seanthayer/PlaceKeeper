/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ComponentWrapper from './components/ComponentWrapper';

/* ------------------------------------------
 *
 *                  LIBRARY
 * 
 * ------------------------------------------
 */

// const GMAPS_GET_TRANSFORMING_DIV = (): HTMLDivElement => GMAPS_GET_INFOBOX_DIV().parentNode as HTMLDivElement;

const QUERY_INFOBOX_DIV = 'div[style*="z-index: 107"]';

const TILE_SIZE = 256;
const X_AXIS_WRAP = 4096; // '4096px'

var GMAPS_MAPEMBED: google.maps.Map | null = null;
var GMAPS_MAPDOMNODE: Element       | null = null;
var GMAPS_INFOBOX_DIV: Element      | null = null;


function generatePositionalOverlay() {



}

function bindToMap(map: google.maps.Map) {

  var waitForMap: NodeJS.Timer;

  waitForMap = setInterval(() => {

    if (map.getRenderingType() !== 'UNINITIALIZED') {

      GMAPS_MAPEMBED = map;
      GMAPS_MAPDOMNODE = GMAPS_MAPEMBED.getDiv();
      GMAPS_INFOBOX_DIV = GMAPS_MAPDOMNODE.querySelector(QUERY_INFOBOX_DIV);

      clearInterval(waitForMap);

      console.log('[DEV] Bound to map,');
      console.log('[DEV] -- GMAPS_MAPEMBED: ', GMAPS_MAPEMBED);
      console.log('[DEV] -- GMAPS_MAPDOMNODE', GMAPS_MAPDOMNODE);
      console.log('[DEV] -- GMAPS_INFOBOX_DIV', GMAPS_INFOBOX_DIV);

    }

  }, 100);

}

function unBind() {

  GMAPS_MAPEMBED = null;
  GMAPS_MAPDOMNODE = null;
  GMAPS_INFOBOX_DIV = null;

  console.log('[DEV] Unbound map');

}

function renderComponent(cClass: React.ComponentClass) {

  let node    = GMAPS_INFOBOX_DIV;
  let el      = React.createElement(cClass);
  let wrapper = React.createElement(ComponentWrapper, {}, el);

  console.log('node => ', node);

  console.log('Element => ', el);
  console.log('Wrapper => ', wrapper);

  return ReactDOM.render(wrapper, node);

}

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {
  
  bindToMap,
  renderComponent 

};