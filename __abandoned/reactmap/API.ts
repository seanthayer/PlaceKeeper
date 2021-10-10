/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';
import ReactDOM from 'react-dom';
// import ReactMap from 'reactmap';

import RenderLayer from './components/RenderLayer';

/* ------------------------------------------
 *
 *               LIBRARY VARS
 * 
 * ------------------------------------------
 */

const QUERY_RENDER_DIV = 'div[style*="z-index: 3"]';
const QUERY_TRANSFORMING_DIV = 'div[style*="z-index: 4"][style*="top: 50%"]';

const MAX_ZOOM = 22;
const MIN_ZOOM = 0;
const TILE_SIZE = 256;
const X_AXIS_WRAP = 4096; // '4096px'

const SCALE = (zoom: number) => 1 << zoom;

var exportConstants = {

  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
  X_AXIS_WRAP

};

var devModule = {

  __DEV__API_PrintCurrentPixelCoords,
  __DEV__API_RecalculateRenderPositions,
  __DEV__API_DoZoom,
  __DEV__API_PrintOffsets

}

var GMAPS_MAPEMBED: google.maps.Map | null = null;
var GMAPS_MAPDOMNODE: Element       | null = null;
var GMAPS_RENDER_DIV: Element       | null = null;
var GMAPS_TRANSFORMING_DIV: Element | null = null;

var REACTMAP_POSLISTENERS: Array<google.maps.MapsEventListener> | null = null;

var REACTMAP_ORIGINPOINT: ReactMap.Point   | null = null;
var REACTMAP_ORIGINLATLNG: ReactMap.LatLng | null = null;

var REACTMAP_RENDERLAYER: RenderLayer | null = null;

var REACTMAP_EVENT_RENDERS_PAUSED: boolean = false;
var REACTMAP_EVENT_DRAG_ACTIVE: boolean = false;
var REACTMAP_EVENT_ZOOM_ACTIVE: boolean = false;

/* ------------------------------------------
 *
 *                  LIBRARY
 * 
 * ------------------------------------------
 */

function __DEV__API_PrintCurrentPixelCoords() {

  let latLng = {

    lat: GMAPS_MAPEMBED!.getCenter()!.lat(),
    lng: GMAPS_MAPEMBED!.getCenter()!.lng()

  }

  let zoom = GMAPS_MAPEMBED!.getZoom()!;

  let center = __calculatePixelCoord(latLng, zoom);

  console.log(`[DEV][ReactMap] Current pixel coord @ Zoom ${zoom} => `, center);  

}

function __DEV__API_RecalculateRenderPositions() {

  let latLng = {

    lat: GMAPS_MAPEMBED!.getCenter()!.lat(),
    lng: GMAPS_MAPEMBED!.getCenter()!.lng()

  }

  let zoom = GMAPS_MAPEMBED!.getZoom()!;

  let center = __calculatePixelCoord(latLng, zoom);

  REACTMAP_RENDERLAYER!.recalculateRenderPositions(center, zoom, __calculatePixelCoord);

}

function __DEV__API_DoZoom() {

  let latLng = {

    lat: GMAPS_MAPEMBED!.getCenter()!.lat(),
    lng: GMAPS_MAPEMBED!.getCenter()!.lng()

  }

  let zoom = GMAPS_MAPEMBED!.getZoom()!;

  let center = __calculatePixelCoord(latLng, zoom);

  REACTMAP_RENDERLAYER!.doZoomTransform(center, zoom, __calculatePixelCoord);

}

function __DEV__API_PrintOffsets() {

  // REACTMAP_RENDERLAYER!.__DEBUG__PrintRenderOffsets();

}

function __projectToMercator(latLng: ReactMap.LatLng): ReactMap.Point {

  // Projection function courtesy of Google's documentation

  let siny = Math.sin((latLng.lat * Math.PI) / 180);

  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return {

    x: TILE_SIZE * (0.5 + latLng.lng / 360),
    y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))

  };

}

function __calculatePixelCoord(latLngOrWorldCoord: ReactMap.LatLng | ReactMap.Point, zoom: number): ReactMap.Point {

  let scale = SCALE(zoom);
  let worldCoord: ReactMap.Point;

  if ('lat' in latLngOrWorldCoord) {

    worldCoord = __projectToMercator(latLngOrWorldCoord);
    
  } else {

    worldCoord = latLngOrWorldCoord;

  }

  return {

    x: Math.floor(worldCoord.x * scale),
    y: Math.floor(worldCoord.y * scale)

  };

}

function __calculateIntermediateCoord(latLng: ReactMap.LatLng, zoom: number, zoomDirection: 'in' | 'out'): ReactMap.Point {

  let originCoord: ReactMap.Point;
  let forwardCoord: ReactMap.Point;

  let intermediateCoord: ReactMap.Point;

  originCoord = __calculatePixelCoord(latLng, zoom);
  forwardCoord = __calculatePixelCoord(latLng, (zoomDirection === 'in' ? (zoom + 1) : (zoom - 1)));

  console.log('[DEV][ReactMap]{__calculateIntermediateCoord} originCoord => ', originCoord);
  console.log('[DEV][ReactMap]{__calculateIntermediateCoord} forwardCoord => ', forwardCoord);

  intermediateCoord = {

    x: (forwardCoord.x + originCoord.x) / 2,
    y: (forwardCoord.y + originCoord.y) / 2,

  }

  return intermediateCoord;

}

function __generateDragListener(map: google.maps.Map): google.maps.MapsEventListener {

  let _start: ReactMap.Point;
  let _end: ReactMap.Point;
  let _forwardZoom: number;
  let transformDiff: ReactMap.Point;

  let originZoom: number;
  let originPixelCenter: ReactMap.Point;

  let zoomDirection: 'in' | 'out' | null;

  let startListener: google.maps.MapsEventListener  | null = null;
  let endListener: google.maps.MapsEventListener    | null = null;
  let idleListener: google.maps.MapsEventListener   | null = null;
  let centerListener: google.maps.MapsEventListener | null = null;

  startListener = google.maps.event.addListener(map, 'dragstart', () => {

    console.log('[DEV][ReactMap] ---------------------------------------------');
    console.log('[DEV][ReactMap][EVENT] dragstart');

    zoomDirection = REACTMAP_RENDERLAYER!.getZoomDirection();

    console.log('[DEV][ReactMap]{__generateDragListener} zoomDirection => ', zoomDirection);

    if (REACTMAP_EVENT_ZOOM_ACTIVE) {

      REACTMAP_RENDERLAYER!.freezeRenderTransitions();
      REACTMAP_RENDERLAYER!.startStaticDrag();

      REACTMAP_EVENT_RENDERS_PAUSED = true;

      endListener = google.maps.event.addListenerOnce(map, 'dragend', () => {

        // REACTMAP_RENDERLAYER!.continueRenderTransitions();
  
        // console.log('[DEV][ReactMap][EVENT] dragend');

        // REACTMAP_RENDERLAYER!.setZoomDirection(map.getZoom()!);

        originPixelCenter = __calculatePixelCoord({ lat: map.getCenter()!.lat(), lng: map.getCenter()!.lng() }, originZoom);
        _forwardZoom = map.getZoom()!;
        
        // console.log('[DEV][ReactMap] originZoom => ', originZoom);
        // console.log('[DEV][ReactMap] originPixelCenter => ', originPixelCenter);
        console.log('[DEV][ReactMap][EVENT] dragend');
        console.log('[DEV][ReactMap] ---------------------------------------------');
  
        REACTMAP_EVENT_RENDERS_PAUSED = false;
        REACTMAP_RENDERLAYER!.stopStaticDrag();
        // REACTMAP_RENDERLAYER!.doDynamicDrag(transformDiff);
        // REACTMAP_RENDERLAYER!.applyStoredOffset();

        _start = __calculateIntermediateCoord({ lat: map.getCenter()!.lat(), lng: map.getCenter()!.lng() }, _forwardZoom, zoomDirection!);

        console.log('[DEV][ReactMap]{__generateDragListener} _start => ', _start);

        centerListener = google.maps.event.addListener(map, 'center_changed', () => {

          _end = __calculateIntermediateCoord({ lat: map.getCenter()!.lat(), lng: map.getCenter()!.lng() }, _forwardZoom, zoomDirection!);

          console.log('[DEV][ReactMap]{__generateDragListener} _end => ', _end);

          transformDiff = {

            x: _start.x - _end.x,
            y: _start.y - _end.y

          }

          console.log('[DEV][ReactMap]{__generateDragListener} transformDiff => ', transformDiff);

          REACTMAP_RENDERLAYER!.doDynamicDrag(transformDiff);

        });

        // For some reason without applying this timeout of 0ms, the resulting transition property within 'doZoomTransform'
        // will be applied to the offset that 'stopMimicking' adjusts on rendered components, causing a visible rubberbanding
        // as the component moved to the adjusted position.
        // Now, this correctly applies an immediate transform on all rendered components, calls for them to recalculate a new path to their 
        // origin points, and more-or-less transitions with the map's zoom animation.
        // setTimeout(() => {

        //   REACTMAP_RENDERLAYER!.doZoomTransform(mapPixelCenter, currZoom, __calculatePixelCoord);

        // });
  
      });

      if (!idleListener) {

        idleListener = google.maps.event.addListenerOnce(map, 'idle', () => {

          originZoom = map.getZoom()!;
          originPixelCenter = __calculatePixelCoord({ lat: map.getCenter()!.lat(), lng: map.getCenter()!.lng() }, originZoom );
  
          // REACTMAP_RENDERLAYER!.stopStaticDrag();

          centerListener && google.maps.event.removeListener(centerListener);

          REACTMAP_RENDERLAYER!.stopDynamicDrag();
  
          setTimeout(() => {
  
            REACTMAP_RENDERLAYER!.doZoomTransform(originPixelCenter, originZoom, __calculatePixelCoord);
  
            idleListener = null;
  
          });
    
        });

      }

    } else if (!idleListener) {

      REACTMAP_RENDERLAYER!.startStaticDrag();
  
      idleListener = google.maps.event.addListenerOnce(map, 'idle', () => {

        console.log('[DEV][ReactMap][EVENT] idle');
  
        REACTMAP_RENDERLAYER!.stopStaticDrag();

        idleListener = null;
  
      });

    }

  });

  return startListener;

}

 function __generateZoomListener(map: google.maps.Map): google.maps.MapsEventListener {

  // ~340 ms on avg. to complete an uninterrupted zoom animation

  let _start: number;

  let mapPixelCenter: ReactMap.Point;
  let currZoom: number;

  let startListener: google.maps.MapsEventListener | null = null;

  startListener = google.maps.event.addListener(map, 'zoom_changed', () => {

    // console.log('[DEV][ReactMap] Zoom change event,');
    // console.log('[DEV][ReactMap] -- Zoom level => ', map.getZoom());

    // _start = Date.now();

    REACTMAP_RENDERLAYER!.setZoomDirection(map.getZoom()!);

    // console.log('[DEV][ReactMap] -- Assigned zoom direction => ', REACTMAP_RENDERLAYER!.getZoomDirection());

    if (!REACTMAP_EVENT_RENDERS_PAUSED) {
  
      REACTMAP_EVENT_ZOOM_ACTIVE = true;
  
      currZoom = map.getZoom()!;
      mapPixelCenter = __calculatePixelCoord({ lat: map.getCenter()!.lat(), lng: map.getCenter()!.lng() }, currZoom );
  
      // console.log('[DEV][ReactMap] mapPixelCenter => ', mapPixelCenter);
  
      REACTMAP_RENDERLAYER!.doZoomTransform(mapPixelCenter, currZoom, __calculatePixelCoord);
  
      google.maps.event.addListenerOnce(map, 'idle', () => {

        // console.log(`[DEV][ReactMap] Zoom time: ${Date.now() - _start}`);
  
        REACTMAP_EVENT_ZOOM_ACTIVE = false;
  
      });
      
    } else {

      // console.log('[DEV][ReactMap] Setting new zoom direction,');
      // console.log('[DEV][ReactMap] -- Zoom level => ', map.getZoom());

      // REACTMAP_RENDERLAYER!.setZoomDirection(map.getZoom()!);

    }

  });

  return startListener;

 }

function __generatePositionListeners(map: google.maps.Map): Array<google.maps.MapsEventListener> {

  let listener_drag: google.maps.MapsEventListener;
  let listener_zoom: google.maps.MapsEventListener;
  let listener_pan: google.maps.MapsEventListener;
  
  listener_drag = __generateDragListener(map);
  listener_zoom = __generateZoomListener(map);
  // listener_pan = . . . generate . . .;
  // listener_wrap = . . . generate . . .;

  return [listener_drag]; // [listener_pan]

}

function __embedRenderLayer(map: google.maps.Map, parentDiv: Element, hostDiv: Element): RenderLayer {

  let temp = parentDiv.appendChild(document.createElement('div'));
  let el = React.createElement(RenderLayer, {

    parentDiv: parentDiv as HTMLDivElement,
    hostDiv: hostDiv as HTMLDivElement,
    mapZoom: map.getZoom()!

  });

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

      REACTMAP_RENDERLAYER = __embedRenderLayer(GMAPS_MAPEMBED, GMAPS_RENDER_DIV!, GMAPS_TRANSFORMING_DIV!);

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

  console.log('[DEV][ReactMap] Rendering component at latLng =>', { lat: latLng.lat(), lng: latLng.lng() });
  
  let worldOrigin = __projectToMercator({

    lat: latLng.lat(),
    lng: latLng.lng()

  });

  let pixelOrigin = __calculatePixelCoord({

    lat: latLng.lat(),
    lng: latLng.lng()

  }, GMAPS_MAPEMBED!.getZoom()!);

  let mapCenter = __calculatePixelCoord({

    lat: GMAPS_MAPEMBED!.getCenter()!.lat(),
    lng: GMAPS_MAPEMBED!.getCenter()!.lng()

  }, GMAPS_MAPEMBED!.getZoom()!);

  let diffX = pixelOrigin.x - mapCenter.x;
  let diffY = pixelOrigin.y - mapCenter.y;

  let offset = { x: diffX, y: diffY };

  REACTMAP_RENDERLAYER!.addRender(cClass, offset, worldOrigin);

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
  renderComponent,
  exportConstants,
  devModule

};