/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import * as React from 'react';

import * as Styles from 'components/Map.styles';

import MapController from 'map-API';
import { loader }    from 'index';

import type { Pin } from 'map-API';

import __DEV__INTERFACE from '__DEV/__DEV__INTERFACE';
import * as ReactMap from 'reactmap-lib/reactmap';


/* ------------------------------------------
 *
 *                    MAP
 * 
 * ------------------------------------------
 */

// - - - - - - - - //

const DEVMODE = true;

// - - - - - - - - //

type MapProps = {

  updatePlaces(places: Array<Pin>): void;

}

class Map extends React.Component<MapProps> {

  /*  Description:
   *    Renders a <div> element for the API to link. Upon mount, initiates API connection, map controller, and window variables.
   *
   *  Window vars generated here:
   *    - window.google
   *    - window.mapController
   */

  render()  {

    return (
      <div id="map" css={Styles.map}></div>
    );

  }

  componentDidMount() {

    // Initiate API connection, then construct map controller

    loader.load().then(() => {

      const google      = window.google;
      const mapDOMNode  = (document.getElementById('map') as HTMLDivElement);

      try {

        const mapEmbed = new google.maps.Map(mapDOMNode, {
  
          center         : { lat: 43.815136416911436, lng: -120.6398112171833 },
          zoom           : 5,
          clickableIcons : false
      
        });

        ReactMap.bindToMap(mapEmbed);

        if (DEVMODE) {

          const dev = new __DEV__INTERFACE(mapEmbed);

          window.dev = dev;
          
        } else {

          const mapController = new MapController(mapEmbed, this.props.updatePlaces);
  
          window.mapController = mapController;

        }
        
      } catch (err) {
       
        console.error('[ERROR]: ' + err);

      }

    });
    
  }

}

export default Map;