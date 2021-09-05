// @ts-nocheck

import PrimitiveElement from "__DEV/components/PrimitiveElement";
import { renderComponent } from "reactmap-lib/reactmap-rendering";

class __DEV__INTERFACE {

  #mapEmbed;
  
  #devAction;
  #globalVarIndex;

  constructor(mapEmbed) {

    const mapEvent = window.google.maps.event;

    this.#mapEmbed = mapEmbed;

    this.#devAction = null;
    this.#globalVarIndex = 0;

    mapEvent.addListener(mapEmbed, 'click', (event) => {

      if (this.#devAction) {

        console.log();
        console.log('-----------------------------------------------');

        console.log('Here\'s the event,');
        console.log(event);

        console.log('-----------------------------------------------');

        console.log('Executing dev action,');
        console.log(this.#devAction);

        console.log('-----------------------------------------------');
        console.log();

        this.#devAction(event);

        // this.#devAction = null;

      } else {

        console.log('No dev action specified');

      }

    });

  }

  __DEV__BindToWindow(arg) {

    window['global' + this.#globalVarIndex] = arg;
    this.#globalVarIndex++;

  }

  __DEV__ONCLICK__LogToConsole(msg) {
    
    this.#devAction = (event) => {

      console.log(msg);
      console.log('and here\'s the latlng => ', event.latLng.lat(), ', ', event.latLng.lng());
      
    }

  }

  __DEV__ONCLICK__GenerateInfoBox(html) {

    const google = window.google;

    this.#devAction = (event) => {

      try {

        let offset  = new google.maps.Size(0, -35, 'pixel', 'pixel');
        let infoBox = new google.maps.InfoWindow();
  
        let div;
  
        infoBox.setOptions({ pixelOffset: offset });
          
        infoBox.setPosition(event.latLng);
  
        div = document.createElement('div');
  
        div.dataset.latlng = infoBox.getPosition()?.toString();
  
        div.insertAdjacentHTML('afterbegin', html);
  
        infoBox.setContent(div);

        infoBox.open(this.#mapEmbed);
  
      } catch (err) {
  
        console.error('[ERROR]: ' + err);
    
        return null;
        
      }
  
    }

  }

  __DEV__ONCLICK__CallLibrary() {

    this.#devAction = (event) => {

      renderComponent(PrimitiveElement);

    }

  }

}

export default __DEV__INTERFACE;