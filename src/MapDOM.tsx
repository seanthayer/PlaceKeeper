/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import * as React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';

import TrashButton from 'components/misc/TrashButton';

import PinInfo from 'components/map/PinInfo';

/* ------------------------------------------
 *
 *                  MAPDOM
 * 
 * ------------------------------------------
 */

export const mapDOMNode = (document.getElementById('map') as HTMLDivElement);

// - - - -

export function getElementByLatLng(latLng: google.maps.LatLng): HTMLDivElement {

  // Careful using this function. The query selector can return null, so be sure
  // the element will exist in the DOM.

  let node = document.getElementById('map') as HTMLDivElement;

  return (node.querySelector(`div [data-latlng="${latLng}"]`) as HTMLDivElement);

}

// - - - -

export const HTML: app.handler.HTMLGen = {

  NewPinForm() {

    return(
      <div className="pin-infoform-container">
  
        <h2 className="pin-infoform-title">Create New Pin</h2>
  
        <fieldset className="pin-infoform-fieldset">
  
          <legend>Pin Details</legend>
  
          <label htmlFor="pin-infoform-name">Name:</label>
          <input type="text" className="pin-infoform-name" name="name" maxLength={30} placeholder="Max 30 characters" /><br/><br/>
  
          <label htmlFor="pin-infoform-description">Description</label><br/>
          <textarea className="pin-infoform-description" name="description" rows={4} cols={28} maxLength={200} placeholder="Max 200 characters"></textarea><br/>
  
          <div className="pin-infoform-buttons-container">
            <button type="button" name="cancel">Cancel</button>
            <button type="button" name="save">Save</button>
          </div>
  
        </fieldset>
  
      </div>
    );

  },

  // PinInfo(context) {

  //   const mapController = window.mapController;

  //   let name        =  context.pin.name;
  //   let description = (context.pin.description ? <div className="pin-infobox-description"><p>{context.pin.description}</p></div> : null);

  //   return(
  //     <div className="pin-infobox-container">

  //       <h2 className="pin-infobox-title">{name}</h2>

  //       {description}

  //       <TrashButton handleTrash={() => {

  //         mapController.removePin( context.pin );
  //         context.cleanUp && context.cleanUp();
          
  //       }}/>

  //     </div>
  //   );

  // }

}

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

let module = {

  mapDOMNode,
  getElementByLatLng,
  HTML

}

export default module;
