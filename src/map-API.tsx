/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import PinInfo from 'components/map/PinInfo';
import app from 'global';

function instanceReactElement<T>(element: React.ReactElement, cleanUp: () => void, node: HTMLElement, props?: T) {

  console.log('instancing');

  let component;

  if (props) {

    component = ReactDOM.render(
    
      React.cloneElement(element, props), node
      
    );
    
  } else {

    component = ReactDOM.render(element, node);

  }

  const observer = new MutationObserver(() => {

    console.log('observer cleaning up');
    
    cleanUp();

  });

  observer.observe(node, { childList: true });
  
  return component;

}

function addPropsAndInstance<T>(element: React.ReactElement, props: T, node: HTMLElement) {

  // The 'Elemental' interface for an embedded component should be casted like
  // 'addPropsAndInstance<embedded.[component].Elemental>()' for type checking properties that
  // are not intrinsic to embedded components.

  console.log('rendering element');
  

  return ReactDOM.render(
    
    React.cloneElement(element, props), node
    
  );

}

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

    // IMPORTANT: If parameter 'opt.html' is of type 'React.ComponentClass', the component in question
    //            MUST make use of the 'cleanUp()' method prop if any of its internal logic causes the info window
    //            to close.
    // Why?:      React cannot know if the component should unmount from within the embed's DOM tree,
    //            so it must be unmounted manually whenever it's known that the containing info window will close.
    //
    // RETURNS:   Also keep in mind that when generating an info window using a ComponentClass, this function only
    //            returns a 'React.ReactElement', so the element will still need to be rendered into the DOM.
    //            Additional props can be added with the top level 'addPropsAndInstance<embedded.[component].Elemental>()' func,
    //            or with 'ReactDOM.render()' using the returned div as the container.

    const google = window.google;
    const mapEvent = google.maps.event;

    const cleanUp = (node: HTMLDivElement) => {

      unmountComponentAtNode( node );

    };

    try {

      let offset  = new google.maps.Size(0, -35, 'pixel', 'pixel');
      let infoBox = new google.maps.InfoWindow();

      let div: HTMLDivElement;
      let ReactComponentClass: React.ComponentClass<any>;
      let ReactElement: React.ReactElement | undefined = undefined;

      infoBox.setOptions({ pixelOffset: offset });

      if (opt) {

        if (typeof opt.html === 'string') {
          
          infoBox.setPosition(opt.pos);

          div = document.createElement('div');

          // Stamp with a unique (lat, lng) identifier, in case it's ever necessary to querySelect it.
          div.dataset.latlng = infoBox.getPosition()?.toString();

          div.insertAdjacentHTML('afterbegin', opt.html);

          infoBox.setContent(div);
          
        } else { //  if (typeof opt.html === 'object')

          ReactComponentClass = opt.html;
          
          infoBox.setPosition(opt.pos);

          div = document.createElement('div');

          // Unique identifier
          div.dataset.latlng = infoBox.getPosition()?.toString();

          infoBox.setContent(div);

          ReactElement = React.createElement(ReactComponentClass, { cleanUp: () => cleanUp(div) });

        }

        mapEvent.addListenerOnce(infoBox, 'closeclick', () => {

          opt.closeClick && opt.closeClick();

          ReactComponentClass && cleanUp(div);
        
        });

        return { window: infoBox, DOMNode: div, element: ReactElement || undefined, cleanUp: ReactElement && (() => cleanUp(div)) };
        
      }

      return { window: infoBox };
      
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

    this._generateListener = this._generateListener.bind(this);
    this.showInfo          = this.showInfo.bind(this);
    this.hide              = this.hide.bind(this);

    this._generateListener();

  }

  // - - - -

  private _generateListener() {

    const mapEvent     = window.google.maps.event;
    this.clickListener = mapEvent.addListenerOnce(this.marker, 'click', this.showInfo);
    
  }

  showInfo() {

    const mapEvent = window.google.maps.event;
    const mapEmbed = this.controller.mapEmbed;

    let resetBox = () => {

      this.infoBox = null;
      this._generateListener();

    };

    let infoBox = MapAPI.generateInfoBox({ pos: this.latLng, html: PinInfo, closeClick: resetBox });
    
    if (infoBox) {

      type element = app.component.embedded.pinInfo.Elemental;

      let component = instanceReactElement<element>(infoBox.element!, infoBox.cleanUp!, infoBox.DOMNode!, { pin: this });

      console.log(component);
      

      // addPropsAndInstance<element>(infoBox.element!, { pin: this }, infoBox.DOMNode!);

      infoBox.window.open(mapEmbed);

      mapEmbed.panTo(this.latLng);

      mapEvent.addListenerOnce(infoBox.window, 'domready', () => {

        this.infoBox = {

          window  : infoBox!.window,
          DOMNode : infoBox!.DOMNode!

        };
  
      });
      
    }

  }

  hide() {

    this.marker.setMap(null);

    this.clickListener && this.clickListener.remove();

    this.infoBox && this.infoBox.window.close();

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
     *    Calls MapDOM to generate a new pin form. Prepares a pin prototype to be passed to method _handleNewPinForm().
     */

    const google   = window.google;
    const mapEvent = google.maps.event;

    let marker = MapAPI.generateMarker(this.mapEmbed, latLng);
    let infoForm = MapAPI.generateInfoBox({ pos: latLng, html: 'test' });

    if (marker && infoForm) {

      this.newPinForm = infoForm.window;

      infoForm.window.open(this.mapEmbed);

      mapEvent.addListenerOnce(infoForm.window, 'domready', () => {

        let pin: app.pin.Prototype = {
  
          marker  : marker!,
          infoBox : {

            window  : infoForm!.window,
            DOMNode : infoForm!.DOMNode!

          },
          latLng  : latLng
  
        };
  
        this._handleNewPinForm(pin, (pin.infoBox as app.pin.InfoBox));
  
      });
      
    }

  }

  private _handleNewPinForm(pin: app.pin.Prototype, infoBox: app.pin.InfoBox) {

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

      pinObjs = this._parsePinPrimitives( (pins as Array<app.pin.GET>) );
      
    }

    this.pinList = this._instancePinObjects(pinObjs || pins);
    
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

  private _parsePinPrimitives(pins: Array<app.pin.Primitive> | Array<app.pin.GET>): Array<app.pin.Object> {

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

  private _instancePinObjects(pins: Array<app.pin.Object>): Array<Pin> {

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
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export default MapController;

export type { Pin };
