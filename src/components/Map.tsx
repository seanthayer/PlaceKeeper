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
import { loader }    from 'index';

import type { Pin } from 'MapAPI';

/* ------------------------------------------
 *
 *                    MAP
 * 
 * ------------------------------------------
 */

declare global {

  interface Window {

    mapDOMNode    : HTMLDivElement;
    mapController : MapController;

  }

}

type MapProps = {

  updatePlaces(places: Array<Pin>): void;

}

class Map extends React.Component<MapProps> {

  /*  Description:
   *    The Map component, signifying the Google Maps embed. Renders a <div> element for the API to link. Upon mount, initiates
   *    API connection, map functionality classes, and global variables.
   * 
   *  Expects props:
   *    - updatePlaces => Function. Set a new state for App component, updating places list.
   *
   *  Global vars generated and assigned here:
   *    - window.google
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

      try {

        const mapEmbed = new google.maps.Map(mapDOMNode, {
  
          center         : { lat: 43.815136416911436, lng: -120.6398112171833 },
          zoom           : 5,
          clickableIcons : false
      
        });
  
        const mapController = new MapController(mapEmbed, this.props.updatePlaces);
  
        window.mapController = mapController;
        
      } catch (err) {
       
        console.error(new Error(err));

      }

    });
    
  }

}

export default Map;