/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

/* ------------------------------------------
 *
 *                  MAPDOM
 * 
 * ------------------------------------------
 */

export const mapDOMNode = (document.getElementById('map') as HTMLDivElement);

// - - - -

export function getElementByLatLng(latLng: google.maps.LatLng): HTMLDivElement {

  let node = document.getElementById('map') as HTMLDivElement;

  return (node.querySelector(`div [data-latlng="${latLng}"]`) as HTMLDivElement);

}

// - - - -

export const HTML: app.handler.HTMLGen = {

  NewPinForm(context) {

    let latLng = context.latLng;

    return ReactDOMServer.renderToString(
      <div className="pin-infoform-container" data-latlng={latLng}>
  
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

  PinInfo(context) {

    let latLng      =  context.latLng;
    let name        =  context.name;
    let description = (context.description ? <div className="pin-infobox-description"><p>{context.description}</p></div> : null);

    return ReactDOMServer.renderToString(
      <div className="pin-infobox-container" data-latlng={latLng}>

        <h2 className="pin-infobox-title">{name}</h2>

        {description}

        <div className="trash-button-container">
          <button type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
        </div>

      </div>
    );

  },

  TrashButton() {

    return ReactDOMServer.renderToString(
      <button type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
    );

  },

  ConfirmText() {

    return ReactDOMServer.renderToString(
      <div className="are-you-sure">Are you sure?<i className="fas fa-check-circle"></i><i className="fas fa-times-circle"></i></div>
    );

  }

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
