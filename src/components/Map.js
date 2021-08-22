/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React   from 'react';
import { css } from '@emotion/react';

import MapInterface from '../MapInterface';
import { loader }   from '../index';

/* ------------------------------------------
 *
 *                    MAP
 * 
 * ------------------------------------------
 */

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
   *    - window.mapInterface
   */

  render() {

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

    // Initiate API connection, construct map functionality classes, and assign global vars.

    loader.load().then(() => {

      const google      = window.google;
      const mapEvent    = google.maps.event;
      const mapDOMNode  = document.getElementById('map');
    
      const mapEmbed = new google.maps.Map(document.getElementById('map'), {
    
        center         : { lat: 43.815136416911436, lng: -120.6398112171833 },
        zoom           : 5,
        clickableIcons : false
    
      });

      const mapInterface  = new MapInterface(mapEmbed, mapDOMNode);

      window.mapEvent     = mapEvent;
      window.mapInterface = mapInterface;

      // Pass the updatePlaces function to MapInterface. Allows synchronising the map embed and React elements' pin lists.
      mapInterface.updatePlaces = this.props.updatePlaces;

      // This single-use click listener prevents multiple new pin forms from being opened on the map.
      // The MapInterface class then re-generates it whenever the form is closed or a new pin is created.
      mapEvent.addListenerOnce(mapEmbed, 'click', mapInterface.generateNewPin);

    });
    
  }

}

export default Map;