/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';
import ReactDOM from 'react-dom';

import RenderLayer from './components/RenderLayer';

/* ------------------------------------------
 *
 *               LIBRARY VARS
 * 
 * ------------------------------------------
 */

const QUERY_RENDER_DIV = 'div[style*="z-index: 3"]';
const QUERY_TRANSFORMING_DIV = 'div[style*="z-index: 4"][style*="top: 50%"]';

const TILE_SIZE = 256;
const X_AXIS_WRAP = 4096; // '4096px'

const SCALE = (zoom: number) => 1 << zoom;

var GMAPS_MAPEMBED: google.maps.Map | null = null;
var GMAPS_MAPDOMNODE: Element       | null = null;
var GMAPS_RENDER_DIV: Element       | null = null;
var GMAPS_TRANSFORMING_DIV: Element | null = null;

var REACTMAP_POSLISTENERS: Array<google.maps.MapsEventListener> | null = null;

var REACTMAP_ORIGINPOINT: ReactMap.Point   | null = null;
var REACTMAP_ORIGINLATLNG: ReactMap.LatLng | null = null;

var REACTMAP_RENDERLAYER: RenderLayer | null = null;

/* ------------------------------------------
 *
 *                  LIBRARY
 * 
 * ------------------------------------------
 */

function __projectToMercator(latLng: ReactMap.LatLng): ReactMap.Point {

  // Projection function courtesy of Google's documentation

  let siny = Math.sin((latLng.lat * Math.PI) / 180);

  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return {

    x: TILE_SIZE * (0.5 + latLng.lng / 360),
    y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))

  };

}

function __calculatePixelCoord(latLng: ReactMap.LatLng, zoom: number): ReactMap.Point {

  let scale = SCALE(zoom);

  let worldCoord = __projectToMercator(latLng);

  return {

    x: Math.floor(worldCoord.x * scale),
    y: Math.floor(worldCoord.y * scale)

  };

}

function __generateDragListener(map: google.maps.Map): google.maps.MapsEventListener {

  let startListener: google.maps.MapsEventListener | null = null;
  let endListener: google.maps.MapsEventListener   | null = null;

  startListener = google.maps.event.addListener(map, 'dragstart', () => {

    if (!endListener) {

      REACTMAP_RENDERLAYER!.mimicHost();
  
      endListener = google.maps.event.addListenerOnce(map, 'idle', () => {
  
        REACTMAP_RENDERLAYER!.stopMimicking();

        endListener = null;
  
      });

    }

  });

  return startListener;

}

function __generatePositionListeners(map: google.maps.Map): Array<google.maps.MapsEventListener> {

  let listener_drag: google.maps.MapsEventListener;
  let listener_pan: google.maps.MapsEventListener;
  
  listener_drag = __generateDragListener(map);
  // listener_pan = . . . generate . . .;

  return [listener_drag]; // [listener_pan]

}

function __embedRenderLayer(parentDiv: Element, hostDiv: Element): RenderLayer {

  let temp = parentDiv.appendChild(document.createElement('div'));
  let el = React.createElement(RenderLayer, { parentDiv: parentDiv as HTMLDivElement, hostDiv: hostDiv as HTMLDivElement });
  let node: HTMLDivElement;

  let component = ReactDOM.render(el, temp);

  node = temp.querySelector('div:first-child')!;

  parentDiv.replaceChild(node!, temp);

  return component;

}

function __logMapBindingMetadata() {

  console.log('[DEV][ReactMap] Bound to map,');
  console.log('[DEV][ReactMap] -- GMAPS_MAPEMBED => ', GMAPS_MAPEMBED);
  console.log('[DEV][ReactMap] -- GMAPS_MAPDOMNODE =>', GMAPS_MAPDOMNODE);
  console.log('[DEV][ReactMap] -- GMAPS_RENDER_DIV =>', GMAPS_RENDER_DIV);
  console.log('[DEV][ReactMap] -- GMAPS_TRANSFORMING_DIV =>', GMAPS_TRANSFORMING_DIV);
  console.log('[DEV][ReactMap] ----------------------');
  console.log('[DEV][ReactMap] -- REACTMAP_RENDERLAYER =>', REACTMAP_RENDERLAYER);
  console.log('[DEV][ReactMap] -- REACTMAP_POSLISTENER =>', REACTMAP_POSLISTENERS);
  console.log('[DEV][ReactMap] -- REACTMAP_ORIGINPOINT =>', REACTMAP_ORIGINPOINT);
  console.log('[DEV][ReactMap] -- REACTMAP_ORIGINLATLNG =>', REACTMAP_ORIGINLATLNG);

}

function unBind() {

  GMAPS_MAPEMBED = null;
  GMAPS_MAPDOMNODE = null;
  GMAPS_RENDER_DIV = null;

  console.log('[DEV][ReactMap] Unbound map');

}

function bindToMap(map: google.maps.Map) {

  var waitForMap: NodeJS.Timer;

  let latLng: ReactMap.LatLng;
  let maxTries = 100;

  waitForMap = setInterval(() => {

    if (map.getRenderingType() !== 'UNINITIALIZED') {

      latLng = {

        lat: map.getCenter()!.lat(),
        lng: map.getCenter()!.lng()

      }

      GMAPS_MAPEMBED = map;
      GMAPS_MAPDOMNODE = GMAPS_MAPEMBED.getDiv();
      GMAPS_RENDER_DIV = GMAPS_MAPDOMNODE.querySelector(QUERY_RENDER_DIV);
      GMAPS_TRANSFORMING_DIV = GMAPS_RENDER_DIV!.querySelector(QUERY_TRANSFORMING_DIV);

      REACTMAP_RENDERLAYER = __embedRenderLayer(GMAPS_RENDER_DIV!, GMAPS_TRANSFORMING_DIV!);

      REACTMAP_POSLISTENERS = __generatePositionListeners(map);
      REACTMAP_ORIGINPOINT = __calculatePixelCoord(latLng, map.getZoom()!);
      REACTMAP_ORIGINLATLNG = latLng;

      // __logMapBindingMetadata();

      clearInterval(waitForMap);

    } else if (maxTries <= 0) {

      console.error('[ReactMap] Map failed to initialize.');
      
      clearInterval(waitForMap);

    } else {

      maxTries--;

    }

  }, 100);

}

function renderComponent(cClass: React.ComponentClass, latLng: google.maps.LatLng): void {

  let clickCoord = __calculatePixelCoord({

    lat: latLng.lat(),
    lng: latLng.lng()

  }, GMAPS_MAPEMBED!.getZoom()!);

  let mapCenter = __calculatePixelCoord({

    lat: GMAPS_MAPEMBED!.getCenter()!.lat(),
    lng: GMAPS_MAPEMBED!.getCenter()!.lng()

  }, GMAPS_MAPEMBED!.getZoom()!);

  let diffX = clickCoord.x - mapCenter.x;
  let diffY = clickCoord.y - mapCenter.y;

  let offset = { x: diffX, y: diffY };

  REACTMAP_RENDERLAYER!.addRender(cClass, offset);

}

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export {
  
  unBind,
  bindToMap,
  renderComponent

};