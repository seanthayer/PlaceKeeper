/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import * as React   from 'react';
import { css }      from '@emotion/react';

import MapController from 'MapAPI';
import { loader }   from 'index';

/* ------------------------------------------
 *
 *                    MAP
 * 
 * ------------------------------------------
 */

declare global {

  interface Window {

    mapEvent : MapEventHandler;
    mapController   : MapController;

  }

}

interface MapEventHandler {

  // Ripped from @types/google.maps/index.d.ts, 'google.maps.event' methods

  addDomListener(
      instance: object, eventName: string, handler: Function,
      capture?: boolean): google.maps.MapsEventListener;

  addDomListenerOnce(
      instance: object, eventName: string, handler: Function,
      capture?: boolean): google.maps.MapsEventListener;

  addListener(instance: object, eventName: string, handler: Function):
      google.maps.MapsEventListener;

  addListenerOnce(
      instance: object, eventName: string,
      handler: Function): google.maps.MapsEventListener;

  clearInstanceListeners(instance: object): void;

  clearListeners(instance: object, eventName: string): void;

  removeListener(listener: google.maps.MapsEventListener): void;

  trigger(instance: object, eventName: string, ...eventArgs: any[]): void;

}

class Map extends React.Component {

  /*  Description:
   *    The Map component, signifying the Google Maps embed. Renders a <div> element for the API to link. Upon mount, initiates
   *    API connection, map functionality classes, and global variables.
   * 
   *  Expects props:
   *    - updatePlaces => Function. Set a new state for App component, updating places list.
   *
   *  Global vars generated and assigned here:
   *    - window.google
   *    - window.mapEvent
   *    - window.mapController
   */

  render()  {

    const mapStyle = css`
    
      width: 100%;
      height: 720px;
      border: 1px solid black;
      border-radius: 5px;

    `;

    return (
      <div id="map" css={mapStyle}></div>
    );

  }

  componentDidMount() {

    // Initiate API connection, construct map interface, and assign global vars.

    loader.load().then(() => {

      const google      = window.google;
      const mapEvent    = google.maps.event;
      const mapDOMNode  = (document.getElementById('map') as HTMLDivElement);

      if (mapDOMNode) {

        const mapEmbed = new google.maps.Map(mapDOMNode, {
    
          center         : { lat: 43.815136416911436, lng: -120.6398112171833 },
          zoom           : 5,
          clickableIcons : false
      
        });

        window.mapEvent = mapEvent;

        const mapController = new MapController(mapEmbed, this.props.updatePlaces);
  
        window.mapController = mapController;

      } else {

        console.error(new Error('Map DOM Node not found!'));

      }

    });
    
  }

}

export default Map;