/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import * as MapDOM from 'MapDOM';

/* ------------------------------------------
 *
 *                 INTERFACES
 * 
 * ------------------------------------------
 */

interface PinInfoBox {

  window   : google.maps.InfoWindow;
  DOMNode  : HTMLDivElement;

}

interface PinPrimitive {

  name          : string;
  description   : string | null;
  lat           : string;
  lng           : string;
  createdAt     : string;

}

interface PinPrototype {

  marker: google.maps.Marker;
  infoBox: PinInfoBox | null;
  latLng: google.maps.LatLng;

}

interface PinContext {

  name         : string;
  description? : string;
  latLng       : google.maps.LatLng;

}

interface PinObject extends PinPrototype, PinContext {}

/* ------------------------------------------
 *
 *                    PIN
 * 
 * ------------------------------------------
 */

class Pin implements PinObject {

  /*  Description:
   *    The standard Pin class. Generated and used to represent every pin on the map embed. Each pin has member functions that
   *    handle its listener generation, infobox generation & handling, and hiding from the map.
   *
   *  Expects:
   *    - pin =>
   *        {
   *          map        : 'MAP_EMBED',
   *          mapDOMNode : 'MAP_DOM_NODE',
   *          marker     : 'MAP_MARKER',
   *          name       : 'PIN_NAME',
   *          latLng     : 'PIN_LATLNG'
   *        }
   */

  controller    : MapController;
  marker        : google.maps.Marker;
  name          : string;
  description?  : string;
  latLng        : google.maps.LatLng;
  clickListener : google.maps.MapsEventListener | null;
  infoBox       : PinInfoBox | null;

  // - - - -

  constructor(controller: MapController, pin: PinObject) {

    this.controller    = controller;
    this.marker        = pin.marker;      // Marker generated by the Maps API.
    this.name          = pin.name;        // Pin's name.
    this.description   = pin.description; // Optional text description.
    this.latLng        = pin.latLng;      // latLng generated by the Maps API. Used to access the latitude & longitude.
    this.clickListener = null;            // Click listener. Generated when calling member function generateListener().

    this.infoBox       = null;            // Infobox. Generated when calling member function showInfo().

    this._generateListener = this._generateListener.bind(this);
    this.showInfo          = this.showInfo.bind(this);
    this._handleInfoBox    = this._handleInfoBox.bind(this);
    this._confirmDelete    = this._confirmDelete.bind(this);
    this.hide              = this.hide.bind(this);

    this._generateListener();

  }

  // - - - -

  private _generateListener(): void {

    const mapEvent     = window.mapEvent;
    this.clickListener = mapEvent.addListenerOnce(this.marker, 'click', this.showInfo);
    
  }

  showInfo(): void {

    /*  Description:
     *    Calls MapDOM to generate the current pin's infobox. Then handles logical interactions with member function _handleInfoBox().
     *
     */

    const mapEvent      = window.mapEvent;
    const mapController = window.mapController;
    const mapEmbed      = this.controller.mapEmbed;

    let context: PinContext = {

      name        : this.name,
      latLng      : this.latLng,
      description : this.description

    }

    let infoWindow = mapController.API.generateInfoBox({ pos: this.latLng, html: MapDOM.HTMLGen.PinInfo(context) });

    if (infoWindow) {

      infoWindow.open(mapEmbed);

      mapEmbed.panTo(this.latLng);

      mapEvent.addListenerOnce(infoWindow, 'domready', () => {

        this.infoBox = {

          window  : (infoWindow as google.maps.InfoWindow),
          DOMNode : MapDOM.getElementByLatLng( (infoWindow as google.maps.InfoWindow).getPosition() )

        };

        this._handleInfoBox(this.infoBox);
  
      });
      
    }

  }

  private _handleInfoBox(infoBox: PinInfoBox): void {

    const mapEvent = window.mapEvent;

    let trashButton = <HTMLButtonElement> infoBox.DOMNode.querySelector(`.trash-button-container > button.trash-button`);

    mapEvent.addDomListenerOnce(trashButton, 'click', () => {

      this._confirmDelete(infoBox);

    });

    // - - - -
    
    mapEvent.addListenerOnce(infoBox, 'closeclick', () => {

      infoBox.window.close();

      this.infoBox = null;
      this._generateListener();

    });

  }

  private _confirmDelete(infoBox: PinInfoBox): void {

    const mapEvent      = window.mapEvent;
    const mapController = window.mapController;

    let buttonContainer = <HTMLDivElement>    infoBox.DOMNode.querySelector(`.trash-button-container`);
    let trashButton     = <HTMLButtonElement> infoBox.DOMNode.querySelector(`.trash-button-container > button.trash-button`);

    let confirmText: HTMLElement;
    let checkButton: HTMLElement;
    let xButton: HTMLElement;

    // Hide the trash button and prompt the user for confirmation.
    buttonContainer.removeChild(trashButton);
    buttonContainer.insertAdjacentHTML('afterbegin', MapDOM.HTMLGen.ConfirmText());

    // Query select for listener interactions.
    confirmText = <HTMLElement> buttonContainer.querySelector('.are-you-sure');
    checkButton = <HTMLElement> buttonContainer.querySelector('.fas.fa-check-circle');
    xButton     = <HTMLElement> buttonContainer.querySelector('.fas.fa-times-circle');

    // Confirm deletion.
    mapEvent.addDomListenerOnce(checkButton,'click', () => {

      mapController.removePin(this);

    });

    // Cancel deletion.
    mapEvent.addDomListenerOnce(xButton, 'click', () => {

      buttonContainer.removeChild(confirmText);
      buttonContainer.insertAdjacentHTML('afterbegin', MapDOM.HTMLGen.TrashButton());

      // Reset the infobox by clearing listeners and calling the handler again.
      mapEvent.clearInstanceListeners(infoBox);

      this._handleInfoBox(infoBox);

    });

  }

  hide(): void {

    this.marker.setMap(null);

    this.clickListener && this.clickListener.remove();
    this.infoBox       && this.infoBox.window.close();

    this.clickListener = null;
    this.infoBox       = null;

  }

}

/* ------------------------------------------
 *
 *                  MAP API
 * 
 * ------------------------------------------
 */

interface APIRequests {

  generateLatLng(coords: number | google.maps.LatLngLiteral): google.maps.LatLng | null;

  generateMarker(map: google.maps.Map, pos?: google.maps.LatLng): google.maps.Marker | null;
  
  generateInfoBox(opt?: { pos?: google.maps.LatLng, html?: string }): google.maps.InfoWindow | null;

}

class MapController {

  /*  Description:
   *    Used to handle all interactions directly associated with the map embed. e.g. Generating new pins, removing pins,
   *    loading / clearing map, synchronising the pin list with React components, etc.
   *
   *  Expects:
   *    - mapEmbed   => A map embed linked with the Maps API.
   *    - mapDOMNode => The DOM node that holds the associated map embed.
   */

  mapEmbed: google.maps.Map;
  mapDOMNode: HTMLDivElement;

  pinList: Array<Pin>;
  newPinForm: google.maps.InfoWindow | null;

  updateReact: (places: Array<Pin>) => void;

  // - - - -

  constructor(mapEmbed: google.maps.Map, mapDOMNode: HTMLDivElement, updateReact: (places: Array<Pin>) => void) {

    const mapEvent = window.mapEvent;

    this.mapEmbed   = mapEmbed;
    this.mapDOMNode = mapDOMNode;
    
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

  API: APIRequests = {

    generateLatLng(coords) {

      const google = window.google;

      try {

        return new google.maps.LatLng(coords);
        
      } catch (err) {
        
        console.error(new Error(err));
        
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

        console.error(new Error(err));
        
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

        console.error(new Error(err));
    
        return null;
        
      }

    }
    
  };

  // - - - -

  showNewPinForm(latLng: google.maps.LatLng): void {

    /*  Description:
     *    Calls MapDOM to generate a new pin form. Prepares a generic pin object to be passed to member function
     *    _handleNewPinForm() for handling logical interactions and constructing a new Pin instance.
     * 
     *  Expects:
     *    - event => Event parameter passed by the map's click listener.
     */

    const google   = window.google;
    const mapEvent = window.mapEvent;

    let marker = this.API.generateMarker(this.mapEmbed, latLng);
    let infoForm = this.API.generateInfoBox({ pos: latLng, html: MapDOM.HTMLGen.NewPinForm() });

    if (marker && infoForm) {

      this.newPinForm = infoForm;

      infoForm.open(this.mapEmbed);

      mapEvent.addListenerOnce(infoForm, 'domready', () => {

        let pin: PinPrototype = {
  
          marker  : (marker as google.maps.Marker),
          infoBox : {

            window  : (infoForm as google.maps.InfoWindow),
            DOMNode : MapDOM.getElementByLatLng( (infoForm as google.maps.InfoWindow).getPosition() )

          },
          latLng  : latLng
  
        };
  
        this._handleNewPinForm(pin, (pin.infoBox as PinInfoBox));
  
      });
      
    }

  }

  // generateInfoBox(latLng: google.maps.LatLng, html: string | Node): google.maps.InfoWindow | null {

  //   /*  Description:
  //    *    Calls the Maps API to generate an infobox on the map embed at the given latLng and with the given HTML content.
  //    *
  //    *  Expects:
  //    *    - latLng => An API latLng object denoting the coordinates to generate the infobox.
  //    *    - html   => The HTML content to display within the infobox.
  //    */



  // }

  private _handleNewPinForm(pin: PinPrototype, infoBox: PinInfoBox): void {

    /*  Description:
     *    Handles logical interactions for a new pin form. Consolidates user input and pin information to generate a new Pin instance.
     *
     *  Expects:
     *    - pin =>
     *        {
     *          marker  : 'MAP_MARKER',
     *          infoBox : 'NEW_PIN_INFOFORM',
     *          latLng  : 'NEW_PIN_LATLNG'
     *        }
     */

    const mapEvent = window.mapEvent;

    let nameField    = <HTMLInputElement>    infoBox.DOMNode.querySelector('input.pin-infoform-name');
    let descField    = <HTMLTextAreaElement> infoBox.DOMNode.querySelector('textarea.pin-infoform-description');
    let saveButton   = <HTMLButtonElement>   infoBox.DOMNode.querySelector('button[name="save"]');
    let cancelButton = <HTMLButtonElement>   infoBox.DOMNode.querySelector('button[name="cancel"]');

    let formattedPinName: string | null;

    // Save event
    mapEvent.addDomListener(saveButton, 'click', () => {

      formattedPinName = nameField.value.trim().replace(/\s+/g, ' ');

      if (formattedPinName) {

        let pinObj: PinObject = {

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
    mapEvent.addListener(infoBox, 'closeclick', () => {

      pin.marker.setMap(null);
      infoBox.window.close();

      this.newPinForm = null;

    });    

  }

  clearMap(): void {

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

  loadMap(pins: Array<PinPrimitive> | Array<PinObject>): void {

    /*  Description:
     *    Render a new map with the given pin list, then update the React places list.
     *
     *  Expects:
     *    - newPins =>
     *        [
     *          {
     *            name        : 'PIN_NAME',
     *            description : 'PIN_DESC',
     *            lat         : 'PIN_LAT',
     *            lng         : 'PIN_LNG'
     *          },
     *          . . .
     *        ]
     */

    let pinObjs: Array<PinObject> = [];

    if ('createdAt' in pins[0]) {

      pinObjs = this.parsePinPrimitives( (pins as Array<PinPrimitive>) );
      
    }

    this.pinList = this.instancePinObjects(pinObjs || pins);
    
    this.updateReact(this.pinList);

  }

  addPin(pin: Pin): void {

    /*  Expects:
     *    - pin => A Pin instance.
     */

    this.pinList.push(pin);
    this.updateReact(this.pinList);

  }

  removePin(pin: Pin): void {

    /*  Expects:
     *    - pin => A Pin instance.
     */

    pin.hide();
    this.pinList.splice(this.pinList.indexOf(pin), 1);
    this.updateReact(this.pinList);

  }

  parsePinPrimitives(pins: Array<PinPrimitive>): Array<PinObject> {

    let arr: Array<PinObject> = [];

    pins.forEach((p) => {

      let coords = { lat: parseFloat(p.lat), lng: parseFloat(p.lng) };

      let latLng = this.API.generateLatLng(coords);
      let marker = (latLng ? this.API.generateMarker(this.mapEmbed, latLng) : null);

      if (latLng && marker) {

        let pinObj: PinObject = {

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

  instancePinObjects(pins: Array<PinObject>): Array<Pin> {

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
