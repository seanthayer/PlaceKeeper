/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import app from 'global';
import * as ReactDOMServer from 'react-dom/server';

/* ------------------------------------------
 *
 *                  MAP API
 * 
 * ------------------------------------------
 */

const MapAPI: app.handler.API = {

  generateLatLng(coords) {

    const google = window.google;

    try {

      return new google.maps.LatLng(coords);
      
    } catch (err) {
      
      console.error('[ERROR]: ' + err);
      
      return null;
      
    }

  },

  generateMarker(map, pos) {

    const google = window.google;

    try {

      return new google.maps.Marker({

        position : (pos ? pos : undefined),
        map      : (map ? map : undefined)
  
      });
      
    } catch (err) {

      console.error('[ERROR]: ' + err);
      
      return null;
      
    }

  },

  generateInfoBox(opt) {

    const google = window.google;

    try {

      let offset  = new google.maps.Size(0, -35, 'pixel', 'pixel');
      let infoBox = new google.maps.InfoWindow();

      infoBox.setOptions({ pixelOffset: offset });

      if (opt) {

        infoBox.setContent(opt.html);
        infoBox.setPosition(opt.pos);
        
      }

      // infoBox.open(map);

      return infoBox;
      
    } catch (err) {

      console.error('[ERROR]: ' + err);
  
      return null;
      
    }

  }
  
};

/* ------------------------------------------
 *
 *                    PIN
 * 
 * ------------------------------------------
 */

class Pin implements app.pin.Object {

  /*  Description:
   *    The standard Pin class. Generated and used to represent every pin on the map embed. Each pin has methods that
   *    handle its listener generation, infobox generation & handling, and hiding from the map.
   */

  controller    : MapController;
  marker        : google.maps.Marker;
  name          : string;
  description?  : string;
  latLng        : google.maps.LatLng;
  clickListener : google.maps.MapsEventListener | null;
  infoBox       : app.pin.InfoBox | null;

  // - - - -

  constructor(controller: MapController, pin: app.pin.Object) {

    this.controller    = controller;
    this.marker        = pin.marker;
    this.name          = pin.name;
    this.description   = pin.description;
    this.latLng        = pin.latLng;
    this.clickListener = null;

    this.infoBox       = null;

    this.__generateListener = this.__generateListener.bind(this);
    this.showInfo           = this.showInfo.bind(this);
    this.__handleInfoBox    = this.__handleInfoBox.bind(this);
    this.__confirmDelete    = this.__confirmDelete.bind(this);
    this.hide               = this.hide.bind(this);

    this.__generateListener();

  }

  // - - - -

  private __generateListener() {

    const mapEvent     = window.google.maps.event;
    this.clickListener = mapEvent.addListenerOnce(this.marker, 'click', this.showInfo);
    
  }

  showInfo() {

    /*  Description:
     *    Calls to generate the current pin's infobox. Then handles logical interactions with member function __handleInfoBox().
     */

    const mapEvent      = window.google.maps.event;
    const mapEmbed      = this.controller.mapEmbed;

    let context: app.pin.Data = {

      name        : this.name,
      latLng      : this.latLng,
      description : this.description

    }

    let infoWindow = MapAPI.generateInfoBox({ pos: this.latLng, html: HTML.PinInfo(context) });

    if (infoWindow) {

      infoWindow.open(mapEmbed);

      mapEmbed.panTo(this.latLng);

      mapEvent.addListenerOnce(infoWindow, 'domready', () => {

        this.infoBox = {

          window  : infoWindow!,
          DOMNode : getElementByLatLng( (infoWindow!.getPosition() as google.maps.LatLng) )

        };

        this.__handleInfoBox(this.infoBox);
  
      });
      
    }

  }

  private __handleInfoBox(infoBox: app.pin.InfoBox) {

    const mapEvent = window.google.maps.event;

    let trashButton = infoBox.DOMNode.querySelector(`.trash-button-container > button.trash-button`) as HTMLButtonElement;

    mapEvent.addDomListenerOnce(trashButton, 'click', () => {

      this.__confirmDelete(infoBox);

    });

    // - - - -
    
    mapEvent.addListenerOnce(infoBox.window, 'closeclick', () => {

      mapEvent.clearInstanceListeners(infoBox);

      infoBox.window.close();

      this.infoBox = null;
      this.__generateListener();

    });

  }

  private __confirmDelete(infoBox: app.pin.InfoBox) {

    const mapEvent      = window.google.maps.event;
    const mapController = window.mapController;

    let buttonContainer = infoBox.DOMNode.querySelector(`.trash-button-container`) as HTMLDivElement;
    let trashButton     = infoBox.DOMNode.querySelector(`.trash-button-container > button.trash-button`) as HTMLButtonElement;

    let confirmText: HTMLElement;
    let checkButton: HTMLElement;
    let xButton: HTMLElement;

    // Hide the trash button and prompt the user for confirmation.
    buttonContainer.removeChild(trashButton);
    buttonContainer.insertAdjacentHTML('afterbegin', HTML.ConfirmText());

    // Query select for listener interactions.
    confirmText = buttonContainer.querySelector('.are-you-sure') as HTMLElement;
    checkButton = buttonContainer.querySelector('.fas.fa-check-circle') as HTMLElement;
    xButton     = buttonContainer.querySelector('.fas.fa-times-circle') as HTMLElement;

    // Confirm deletion.
    mapEvent.addDomListenerOnce(checkButton,'click', () => {

      mapController.removePin(this);

    });

    // Cancel deletion.
    mapEvent.addDomListenerOnce(xButton, 'click', () => {      

      buttonContainer.removeChild(confirmText);
      buttonContainer.insertAdjacentHTML('afterbegin', HTML.TrashButton());

      // Reset the infobox by clearing listeners and calling the handler again.
      mapEvent.clearInstanceListeners(infoBox.window);

      this.__handleInfoBox(infoBox);

    });

  }

  hide() {

    this.marker.setMap(null);

    this.clickListener && this.clickListener.remove();
    this.infoBox       && this.infoBox.window.close();

    this.clickListener = null;
    this.infoBox       = null;

  }

}

/* ------------------------------------------
 *
 *               MAP CONTROLLER
 * 
 * ------------------------------------------
 */

class MapController {

  /*  Description:
   *    Used to handle all interactions directly associated with the map embed. e.g. Generating new pins, removing pins,
   *    loading / clearing map, synchronising the pin list with React components, etc.
   */

  updateReact: (places: Array<Pin>) => void;

  mapEmbed: google.maps.Map;

  pinList: Array<Pin>;
  newPinForm: google.maps.InfoWindow | null;

  // - - - -

  constructor(mapEmbed: google.maps.Map, updateReact: (places: Array<Pin>) => void) {
    
    const mapEvent = window.google.maps.event;

    this.mapEmbed   = mapEmbed;
    
    this.pinList    = [];
    this.newPinForm = null;

    this.showNewPinForm  = this.showNewPinForm.bind(this);
    this.clearMap        = this.clearMap.bind(this);
    this.loadMap         = this.loadMap.bind(this);
    this.addPin          = this.addPin.bind(this);
    this.removePin       = this.removePin.bind(this);

    this.updateReact = updateReact;

    // - - - -

    mapEvent.addListener(mapEmbed, 'click', (event: google.maps.MapMouseEvent) => {

      if (!this.newPinForm) {
      
        this.showNewPinForm( (event.latLng as google.maps.LatLng) );

      }

    });

  }

  // - - - -

  showNewPinForm(latLng: google.maps.LatLng) {

    /*  Description:
     *    Calls to generate a new pin form. Prepares a pin prototype to be passed to method __handleNewPinForm().
     */

    const google   = window.google;
    const mapEvent = google.maps.event;

    let marker = MapAPI.generateMarker(this.mapEmbed, latLng);
    let infoForm = MapAPI.generateInfoBox({ pos: latLng, html: HTML.NewPinForm({ latLng }) });

    if (marker && infoForm) {

      this.newPinForm = infoForm;

      infoForm.open(this.mapEmbed);

      mapEvent.addListenerOnce(infoForm, 'domready', () => {

        let pin: app.pin.Prototype = {
  
          marker  : marker!,
          infoBox : {

            window  : infoForm!,
            DOMNode : getElementByLatLng( (infoForm!.getPosition() as google.maps.LatLng) )

          },
          latLng  : latLng
  
        };
  
        this.__handleNewPinForm(pin, (pin.infoBox as app.pin.InfoBox));
  
      });
      
    }

  }

  private __handleNewPinForm(pin: app.pin.Prototype, infoBox: app.pin.InfoBox) {

    /*  Description:
     *    Handles logical interactions for a new pin form. Consolidates input and instances a new pin.
     */

    const mapEvent = window.google.maps.event;

    let nameField    = infoBox.DOMNode.querySelector('input.pin-infoform-name') as HTMLInputElement;
    let descField    = infoBox.DOMNode.querySelector('textarea.pin-infoform-description') as HTMLTextAreaElement;
    let saveButton   = infoBox.DOMNode.querySelector('button[name="save"]') as HTMLButtonElement;
    let cancelButton = infoBox.DOMNode.querySelector('button[name="cancel"]') as HTMLButtonElement;

    let formattedPinName: string | null;

    // Save event
    mapEvent.addDomListener(saveButton, 'click', () => {

      formattedPinName = nameField.value.trim().replace(/\s+/g, ' ');

      if (formattedPinName) {

        let pinObj: app.pin.Object = {

          name        : formattedPinName,
          description : (descField.value || undefined),
          marker      : pin.marker,
          latLng      : pin.latLng,
          infoBox     : null

        }

        let _pin = new Pin(this, pinObj);

        this.addPin(_pin);

        infoBox.window.close();

        this.newPinForm = null;

      } else {

        alert('You must enter a name for a new pin.');

      }

    });

    // Exit event
    mapEvent.addDomListener(cancelButton, 'click', () => {

      pin.marker.setMap(null);
      infoBox.window.close();

      this.newPinForm = null;

    });

    // Exit event
    mapEvent.addDomListenerOnce(infoBox.window, 'closeclick', () => {

      pin.marker.setMap(null);
      infoBox.window.close();

      this.newPinForm = null;

    });    

  }

  clearMap() {

    /*  Description:
     *    Hide all currently displayed pins and clear the map's pin list, then update the React places list.
     */

    this.newPinForm && this.newPinForm.close();

    this.pinList.forEach((pin) => {

      pin.hide();

    });

    this.pinList = [];
    this.updateReact(this.pinList);

  }

  loadMap(pins: Array<app.pin.GET> | Array<app.pin.Object>) {

    /*  Description:
     *    Render a new map with the given pin list, then update the React places list.
     */

    let pinObjs: Array<app.pin.Object> = [];

    if ('createdAt' in pins[0]) {

      pinObjs = this.__parsePinPrimitives( (pins as Array<app.pin.GET>) );
      
    }

    this.pinList = this.__instancePinObjects(pinObjs || pins);
    
    this.updateReact(this.pinList);

  }

  addPin(pin: Pin) {

    this.pinList.push(pin);
    this.updateReact(this.pinList);

  }

  removePin(pin: Pin) {

    pin.hide();
    this.pinList.splice(this.pinList.indexOf(pin), 1);
    this.updateReact(this.pinList);

  }

  private __parsePinPrimitives(pins: Array<app.pin.Primitive> | Array<app.pin.GET>): Array<app.pin.Object> {

    /*  Description:
     *    Parses pin primitives or pins received from the server into pin objects.
     */

    let arr: Array<app.pin.Object> = [];

    pins.forEach((p) => {

      let coords = 
        { lat: parseFloat( (p.lat as string) ), 
          lng: parseFloat( (p.lng as string) ) };
          

      let latLng = MapAPI.generateLatLng(coords);
      let marker = (latLng ? MapAPI.generateMarker(this.mapEmbed, latLng) : null);

      if (latLng && marker) {

        let pinObj: app.pin.Object = {

          name        : p.name,
          description : (p.description || undefined),
          marker      : marker,
          latLng      : latLng,
          infoBox     : null
  
        }
  
        arr.push(pinObj);
        
      }

    });

    return arr;

  }

  private __instancePinObjects(pins: Array<app.pin.Object>): Array<Pin> {

    /*  Description:
     *    Instances an array of pin objects.
     */

    let arr: Array<Pin> = [];

    pins.forEach((p) => {

      let _pin = new Pin(this, p);

      arr.push(_pin);

    });

    return arr;

  }

}

/* ------------------------------------------
 *
 *                  MAP DOM
 * 
 * ------------------------------------------
 */

function getElementByLatLng(latLng: google.maps.LatLng): HTMLDivElement {

  let node = document.getElementById('map') as HTMLDivElement;

  return (node.querySelector(`div [data-latlng="${latLng}"]`) as HTMLDivElement);

}

const HTML: app.handler.HTMLGen = {

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

export default MapController;

export type { Pin };