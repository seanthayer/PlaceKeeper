/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';
import ReactDOM from 'react-dom';

import RefWrapper from './components/RefWrapper';
import ComponentWrapper from './components/ComponentWrapper';

import { RenderedComponent } from './reactmap-objects';

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

const SCALE = (zoom: number) => 1 << zoom;

var GMAPS_MAPEMBED: google.maps.Map | null = null;
var GMAPS_MAPDOMNODE: Element       | null = null;
var GMAPS_INFOBOX_DIV: Element      | null = null;

var REACTMAP_POSLISTENERS: Array<google.maps.MapsEventListener> | null = null;

var REACTMAP_ORIGINPOINT: google.maps.Point   | null = null;
var REACTMAP_ORIGINLATLNG: google.maps.LatLng | null = null;

var REACTMAP_RENDEREDCOMPONENTS: Array<RenderedComponent> = [];
const REACTMAP_ADD_RENDER = (component: RenderedComponent) => {

  REACTMAP_RENDEREDCOMPONENTS.push(component);

};
const REACTMAP_REMOVE_RENDER = (component: RenderedComponent) => {

  let i = REACTMAP_RENDEREDCOMPONENTS.indexOf(component);

  let el = REACTMAP_RENDEREDCOMPONENTS.splice(i, 1);

  // PSEUDO: unmount(el) to free memory

};

function __projectToMercator(latLng: google.maps.LatLng): google.maps.Point {

  // Projection function courtesy of Google's documentation

  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(

    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))

  );

}

function __calculatePixelCoord(latLng: google.maps.LatLng, zoom: number): google.maps.Point {

  let scale = SCALE(zoom);

  let worldCoord = __projectToMercator(latLng);

  return new google.maps.Point(

    Math.floor(worldCoord.x * scale),
    Math.floor(worldCoord.y * scale)

  );

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
  console.log(`[DEV][reactmap] Offsetting by => (${offsetX}, ${offsetY})px`);
  console.log('--------------------------------------------------');

  component.offsetDiv.style.left = `${offsetX}px`;
  component.offsetDiv.style.top = `${offsetY}px`;
  
  // TODO: Figure out whether there's any difference between calculating the offset by the distance
  //       covered in the drag event, or by calculating the change in a component's origin point to center.

}

function __offsetRenderedComponents(x: number, y: number) {

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

}

function __generateDragListener(map: google.maps.Map): google.maps.MapsEventListener {

  let listener: google.maps.MapsEventListener;
  let dragStartPoint: google.maps.Point;
  let dragEndPoint: google.maps.Point;

  let diffX: number;
  let diffY: number;

  listener = google.maps.event.addListener(map, 'dragstart', () => {
    
    dragStartPoint = __calculatePixelCoord(map.getCenter()!, map.getZoom()!);

    console.log();
    console.log('--------------------------------------------------');

    console.log('[DEV][reactmap] dragstart event,');
    console.log(`[DEV][reactmap]   --> start: (${dragStartPoint.x}, ${dragStartPoint.y})`);
    console.log('--------------------------------------------------');

    google.maps.event.addListenerOnce(map, 'dragend', () => {

      console.log('[DEV][reactmap] dragend event,');

      google.maps.event.addListenerOnce(map, 'idle', () => {

        dragEndPoint = __calculatePixelCoord(map.getCenter()!, map.getZoom()!);

        diffX = dragEndPoint.x - dragStartPoint.x;
        diffY = dragEndPoint.y - dragStartPoint.y;

        console.log('[DEV][reactmap] idle event,');
        console.log(`[DEV][reactmap]   --> end: (${dragEndPoint.x}, ${dragEndPoint.y})`);
        console.log('--------------------------------------------------');
        console.log(`[DEV][reactmap]   --> diff: (${diffX}, ${diffY})`);
  
        console.log('--------------------------------------------------');
        console.log();

        __offsetRenderedComponents(diffX, diffY);

      });

    });

  });

  return listener;

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

function unBind() {

  GMAPS_MAPEMBED = null;
  GMAPS_MAPDOMNODE = null;
  GMAPS_INFOBOX_DIV = null;

  console.log('[DEV] Unbound map');

}

function bindToMap(map: google.maps.Map) {

  var waitForMap: NodeJS.Timer;

  waitForMap = setInterval(() => {

    if (map.getRenderingType() !== 'UNINITIALIZED') {

      GMAPS_MAPEMBED = map;
      GMAPS_MAPDOMNODE = GMAPS_MAPEMBED.getDiv();
      GMAPS_INFOBOX_DIV = GMAPS_MAPDOMNODE.querySelector(QUERY_INFOBOX_DIV);

      REACTMAP_POSLISTENERS = __generatePositionListeners(map);
      REACTMAP_ORIGINPOINT = __calculatePixelCoord(map.getCenter()!, map.getZoom()!);
      REACTMAP_ORIGINLATLNG = map.getCenter()!;

      clearInterval(waitForMap);

      console.log('[DEV][reactmap] Bound to map,');
      console.log('[DEV][reactmap] -- GMAPS_MAPEMBED => ', GMAPS_MAPEMBED);
      console.log('[DEV][reactmap] -- GMAPS_MAPDOMNODE =>', GMAPS_MAPDOMNODE);
      console.log('[DEV][reactmap] -- GMAPS_INFOBOX_DIV =>', GMAPS_INFOBOX_DIV);
      console.log('[DEV][reactmap] ----------------------');
      console.log('[DEV][reactmap] -- REACTMAP_POSLISTENER =>', REACTMAP_POSLISTENERS);
      console.log('[DEV][reactmap] -- REACTMAP_ORIGINPOINT =>', REACTMAP_ORIGINPOINT);
      console.log('[DEV][reactmap] -- REACTMAP_ORIGINLATLNG =>', REACTMAP_ORIGINLATLNG);

    }

  }, 100);

}

function renderComponent(cClass: React.ComponentClass, latLng: google.maps.LatLng): void {

  let origin = __calculatePixelCoord(latLng, GMAPS_MAPEMBED?.getZoom()!);
  let center = __calculatePixelCoord(GMAPS_MAPEMBED?.getCenter()!, GMAPS_MAPEMBED?.getZoom()!);

  let diffX = origin.x - center.x;
  let diffY = origin.y - center.y;

  let offset = { x: diffX, y: diffY };

  let node    = GMAPS_INFOBOX_DIV;
  let refComp = React.createRef<React.Component>();
  let refDiv  = React.createRef<HTMLDivElement>();

  let el = React.createElement(cClass);

  let componentWrapper = React.createElement(ComponentWrapper, { ref: refComp, offset: offset}, el);
  let refWrapper       = React.createElement(RefWrapper, { ref: refDiv }, componentWrapper);

  let render: RenderedComponent;

  console.log('[DEV][reactmap] node => ', node);

  console.log('[DEV][reactmap] Element => ', el);
  console.log('[DEV][reactmap] Ref Wrapper => ', refWrapper);
  console.log('[DEV][reactmap] Component Wrapper => ', componentWrapper);

  ReactDOM.render(refWrapper, node);

  // REACTMAP_ADD_RENDER(render);
  // console.log('[DEV][reactmap] Rendered components => ', REACTMAP_RENDEREDCOMPONENTS);

  console.log('[DEV][reactmap] Component ref, ');
  console.log(refComp);

  console.log('[DEV][reactmap] Div ref, ');
  console.log(refDiv);

  render = new RenderedComponent(refComp, refDiv, origin, offset);

  REACTMAP_ADD_RENDER(render);
  console.log('[DEV][reactmap] Rendered components => ', REACTMAP_RENDEREDCOMPONENTS);

  render.logMetadata();

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