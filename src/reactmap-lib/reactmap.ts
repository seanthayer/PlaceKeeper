/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';
import ReactDOM from 'react-dom';

import RenderLayer from './components/RenderLayer';

import { RenderedComponent } from './reactmap-objects';
import reactmap from 'reactmap-lib';

/* ------------------------------------------
 *
 *                  LIBRARY
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

var REACTMAP_ORIGINPOINT: reactmap.Point   | null = null;
var REACTMAP_ORIGINLATLNG: reactmap.LatLng | null = null;

var REACTMAP_RENDERLAYER: RenderLayer | null = null;


function __projectToMercator(latLng: reactmap.LatLng): reactmap.Point {

  // Projection function courtesy of Google's documentation

  let siny = Math.sin((latLng.lat * Math.PI) / 180);

  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return {

    x: TILE_SIZE * (0.5 + latLng.lng / 360),
    y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))

  };

}

function __calculatePixelCoord(latLng: reactmap.LatLng, zoom: number): reactmap.Point {

  let scale = SCALE(zoom);

  let worldCoord = __projectToMercator(latLng);

  return {

    x: Math.floor(worldCoord.x * scale),
    y: Math.floor(worldCoord.y * scale)

  };

}

function __applyOffset(component: RenderedComponent, x: number, y: number) {

  // Rendered components need to be offset by the opposite difference of two (x, y) points to maintain their (lat, lng) position.
  // So the sign of the inputs are switched in this function.

  let offsetX = x * -1;
  let offsetY = y * -1;

  let styleLeft = component.offsetDiv.style.left;
  let styleTop = component.offsetDiv.style.top;

  let prevLeftStr = styleLeft.match(/-?[0-9]+/g)![0];
  let prevTopStr = styleTop.match(/-?[0-9]+/g)![0];

  let prevLeft = parseInt(prevLeftStr);
  let prevTop = parseInt(prevTopStr);

  offsetX += prevLeft;
  offsetY += prevTop;

  console.log('--------------------------------------------------');
  console.log('[DEV][reactmap] Offsetting component => ', component);
  console.log(`[DEV][reactmap] New offset => (${offsetX}, ${offsetY})px`);
  console.log('--------------------------------------------------');

  component.offsetDiv.style.left = `${offsetX}px`;
  component.offsetDiv.style.top = `${offsetY}px`;
  
  // TODO: Figure out whether there's any difference between calculating the offset by the distance
  //       covered in the drag event, or by calculating the change in a component's origin point to center.

}

function __offsetRenderedComponents(x: number, y: number) {

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Possibly useful

  /*
  REACTMAP_RENDEREDCOMPONENTS.forEach((e) => {

    console.log('[DEV][reactmap] Element => ', e);
    console.log('[DEV][reactmap] Offset div => ', e.offsetDiv);
    console.log('[DEV][reactmap][BEFORE] Offset div styles,');
    console.log(`[DEV][reactmap] -- left: ${e.offsetDiv.style.left}`);
    console.log(`[DEV][reactmap] -- top: ${e.offsetDiv.style.top}`);

    __applyOffset(e, x, y);

    console.log('[DEV][reactmap][AFTER] Offset div styles,');
    console.log(`[DEV][reactmap] -- left: ${e.offsetDiv.style.left}`);
    console.log(`[DEV][reactmap] -- top: ${e.offsetDiv.style.top}`);

  });
  */

}

function __optimizeRenderedComponents(opt?: { remove: boolean }) {

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Possibly useful

  /*
  if (opt && opt.remove) {

    REACTMAP_RENDEREDCOMPONENTS.forEach((e) => {

      e.offsetDiv.style.willChange = 'auto';
  
    });
    
  } else {

    REACTMAP_RENDEREDCOMPONENTS.forEach((e) => {

      e.offsetDiv.style.willChange = 'top, left';
  
    });

  }
  */

}

function __generateDragListener(map: google.maps.Map): google.maps.MapsEventListener {

  let startListener: google.maps.MapsEventListener | null = null;
  let endListener: google.maps.MapsEventListener   | null = null;
  let dragStartPoint: reactmap.Point;
  let dragEndPoint: reactmap.Point;

  let latLng: reactmap.LatLng;

  let diffX: number;
  let diffY: number;

  startListener = google.maps.event.addListener(map, 'dragstart', () => {

    if (!endListener) {

      latLng = {

        lat: map.getCenter()!.lat(),
        lng: map.getCenter()!.lng()

      }

      REACTMAP_RENDERLAYER!.mimicHost();

      // __optimizeRenderedComponents();

      dragStartPoint = __calculatePixelCoord(latLng, map.getZoom()!);

      // console.log();
      // console.log('--------------------------------------------------');
  
      // console.log('[DEV][reactmap] dragstart event,');
      // console.log(`[DEV][reactmap]   --> start: (${dragStartPoint.x}, ${dragStartPoint.y})`);
      // console.log('--------------------------------------------------');
  
      endListener = google.maps.event.addListenerOnce(map, 'idle', () => {

        latLng = {

          lat: map.getCenter()!.lat(),
          lng: map.getCenter()!.lng()
  
        }
  
        dragEndPoint = __calculatePixelCoord(latLng, map.getZoom()!);
  
        diffX = dragEndPoint.x - dragStartPoint.x;
        diffY = dragEndPoint.y - dragStartPoint.y;
  
        // console.log('[DEV][reactmap] idle event,');
        // console.log(`[DEV][reactmap]   --> end: (${dragEndPoint.x}, ${dragEndPoint.y})`);
        // console.log('--------------------------------------------------');
        // console.log(`[DEV][reactmap]   --> diff: (${diffX}, ${diffY})`);
  
        // console.log('--------------------------------------------------');
        // console.log();

        // REACTMAP_RENDERLAYER!.finishObserving();
  
        REACTMAP_RENDERLAYER!.stopMimic();
        // REACTMAP_RENDERLAYER!.offsetRenderedComponents(diffX, diffY);

        // __optimizeRenderedComponents({ remove: true });

        endListener = null;
  
      });

    }

    /*google.maps.event.addListenerOnce(map, 'dragend', () => {

      console.log('[DEV][reactmap] dragend event,');

    });*/

  });

  return startListener;

}

function __generatePositionListeners(map: google.maps.Map): Array<google.maps.MapsEventListener> {

  let listener_drag: google.maps.MapsEventListener;
  let listener_pan: google.maps.MapsEventListener;
  
  listener_drag = __generateDragListener(map);

  return [listener_drag]; // [listener_pan]
  
  /* map.addListener('center_changed', () => {

    let zoom = map.getZoom()!;
    let latLng = map.getCenter()!;

    let pixelCoord = __calculatePixelCoord(latLng, zoom);

    console.log();
    console.log('--------------------------------------------------');

    console.log('[DEV][reactmap] (lat , lng):');
    console.log(`[DEV][reactmap] -- Origin (${REACTMAP_ORIGINLATLNG!.lat()} , ${REACTMAP_ORIGINLATLNG!.lng()})`);
    console.log(`[DEV][reactmap] -- New    (${latLng.lat()} , ${latLng.lng()})`);
    console.log('[DEV][reactmap] __________________________________________');
    console.log(`[DEV][reactmap] -- Diff   (${latLng.lat() - REACTMAP_ORIGINLATLNG!.lat()} , ${latLng.lng() - REACTMAP_ORIGINLATLNG!.lng()})`);

    console.log('--------------------------------------------------');

    console.log('[DEV][reactmap] (x , y):');
    console.log(`[DEV][reactmap] -- Origin (${REACTMAP_ORIGINPOINT!.x} , ${REACTMAP_ORIGINPOINT!.y})`);
    console.log(`[DEV][reactmap] -- New    (${pixelCoord.x} , ${pixelCoord.y})`);
    console.log('[DEV][reactmap] __________________________________________');
    console.log(`[DEV][reactmap] -- Diff   (${pixelCoord.x - REACTMAP_ORIGINPOINT!.x} , ${pixelCoord.y - REACTMAP_ORIGINPOINT!.y})`);

    console.log('--------------------------------------------------');
    console.log();

    REACTMAP_ORIGINPOINT = pixelCoord;
    REACTMAP_ORIGINLATLNG = latLng;

  }); */

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

function unBind() {

  GMAPS_MAPEMBED = null;
  GMAPS_MAPDOMNODE = null;
  GMAPS_RENDER_DIV = null;

  console.log('[DEV] Unbound map');

}

function bindToMap(map: google.maps.Map) {

  var waitForMap: NodeJS.Timer;

  let latLng: reactmap.LatLng;
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

      clearInterval(waitForMap);

      // console.log('[DEV][reactmap] Bound to map,');
      // console.log('[DEV][reactmap] -- GMAPS_MAPEMBED => ', GMAPS_MAPEMBED);
      // console.log('[DEV][reactmap] -- GMAPS_MAPDOMNODE =>', GMAPS_MAPDOMNODE);
      // console.log('[DEV][reactmap] -- GMAPS_RENDER_DIV =>', GMAPS_RENDER_DIV);
      // console.log('[DEV][reactmap] -- GMAPS_TRANSFORMING_DIV =>', GMAPS_TRANSFORMING_DIV);
      // console.log('[DEV][reactmap] ----------------------');
      console.log('[DEV][reactmap] -- REACTMAP_RENDERLAYER =>', REACTMAP_RENDERLAYER);
      // console.log('[DEV][reactmap] -- REACTMAP_POSLISTENER =>', REACTMAP_POSLISTENERS);
      // console.log('[DEV][reactmap] -- REACTMAP_ORIGINPOINT =>', REACTMAP_ORIGINPOINT);
      // console.log('[DEV][reactmap] -- REACTMAP_ORIGINLATLNG =>', REACTMAP_ORIGINLATLNG);      

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