// @ts-nocheck

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import PrimitiveElement from "__DEV/components/PrimitiveElement";
import { renderComponent } from "reactmap/API";

import { devModule } from "reactmap/API";

/* ------------------------------------------
 *
 *              __DEV__INTERFACE
 * 
 * ------------------------------------------
 */

class __DEV__INTERFACE {

  #mapEmbed;
  
  #devAction;
  #globalVarIndex;

  #x;
  #y;

  #lat;
  #lng;

  #oldTop = 0;
  #oldLeft = 0;

  constructor(mapEmbed) {

    const mapEvent = window.google.maps.event;

    this.#mapEmbed = mapEmbed;

    this.#devAction = null;
    this.#globalVarIndex = 0;

    this.#lat = mapEmbed.getCenter().lat();
    this.#lng = mapEmbed.getCenter().lng();

    this.#x = 0;
    this.#y = 0;

    mapEvent.addListener(mapEmbed, 'click', (event) => {

      if (this.#devAction) {

        console.log();
        console.log('-----------------------------------------------');

        console.log('[DEV][interface] Click event,');
        console.log(event);

        console.log('-----------------------------------------------');

        console.log('[DEV][interface] Executing dev action,');
        console.log(this.#devAction);

        console.log('-----------------------------------------------');
        console.log();

        this.#devAction(event);

        // this.#devAction = null;

      } else {

        console.log('[DEV][interface] No dev action specified');

      }

    });

  }

  __DEV__ExposeMapAPI() {

    window.map = this.#mapEmbed;

  }

  __DEV__RecalculateRenderPositions() {

    devModule.__DEV__API_RecalculateRenderPositions();

  }

  __DEV__DoZoom() {

    devModule.__DEV__API_DoZoom();

  }

  __DEV__PrintOffsets() {

    devModule.__DEV__API_PrintOffsets();

  }

  __DEV__BindToWindow(arg) {

    this.#globalVarIndex++;
    window['global' + this.#globalVarIndex] = arg;

  }

  __DEV__ONCLICK__LogToConsole(msg) {
    
    this.#devAction = (event) => {

      console.log('[DEV][interface] ', msg);
      console.log('and here\'s the latlng => ', event.latLng.lat(), ', ', event.latLng.lng());
      
    }

  }

  __DEV__RunCurrentDevActionNTimes(n: number) {

    let i = n;

    while (i > 0) {

      this.#devAction();

      i--;

    }

  }

  __DEV__GenerateOneHundredInfoBoxes() {

    let i = 100;
    let flag = 1;

    this.__DEV__ONCLICK__GenerateInfoBox('<h1>Hello</h1>');

    while (i > 0) {

      (Math.random() > 0.5 ? flag = 1 : flag = -1);

      this.#devAction({ latLng: { lat: (Math.random() * 90) * flag, lng: (Math.random() * 180) * flag }})

      i--;

    }

  }

  __DEV__ONCLICK__GenerateInfoBox(html) {

    this.#devAction = (event) => {

      try {

        // let offset  = new google.maps.Size(0, -35, 'pixel', 'pixel');
        let infoBox = new google.maps.InfoWindow();
  
        let div;
  
        // infoBox.setOptions({ pixelOffset: offset });
          
        infoBox.setPosition(event.latLng);
  
        div = document.createElement('div');
  
        div.dataset.latlng = infoBox.getPosition()?.toString();
  
        div.insertAdjacentHTML('afterbegin', html);
  
        infoBox.setContent(div);

        infoBox.open(this.#mapEmbed);

        infoBox.addListener('domready', () => this.__DEV__ObserveInfoBoxOffset(div.dataset.latlng));

        this.__DEV__BindToWindow(infoBox);
        this.__DEV__BindToWindow(() => {

          this.#mapEmbed.panTo(infoBox.getPosition());

        });
  
      } catch (err) {
  
        console.error('[ERROR]: ' + err);
    
        return null;
        
      }
  
    }

  }

  __DEV__ObserveInfoBoxOffset(infoboxLatLng) {

    let offsetDiv = this.#mapEmbed.getDiv().querySelector(`div[data-latlng="${infoboxLatLng}"]`)
                    .parentNode.parentNode.parentNode.parentNode;

    let observer = new MutationObserver(() => {

      let newTop = offsetDiv.style.top;
      let newLeft = offsetDiv.style.left;

      console.log('[DEV][interface] ---------------------------');
      console.log('[DEV][interface] -- Top => ', newTop);
      console.log('[DEV][interface] -- Left => ', newLeft);
      console.log('[DEV][interface] -- Diff,');
      console.log('[DEV][interface] ---- Top => ', parseInt(newTop) - this.#oldTop);
      console.log('[DEV][interface] ---- Left => ', parseInt(newLeft) - this.#oldLeft);
      console.log('[DEV][interface] ---------------------------');

      this.#oldTop = parseInt(newTop);
      this.#oldLeft = parseInt(newLeft);

    });

    console.log('[DEV][interface] Observing div => ', offsetDiv);

    observer.observe(offsetDiv, { attributes: true });

    this.__DEV__BindToWindow(observer);

  }

  __DEV__ONCLICK__ReactMapRenderComponent() {

    this.#devAction = (event) => {

      renderComponent(PrimitiveElement, event.latLng);

    }

  }

  __DEV__ONCLICK__PanBy(x, y) {

    this.#devAction = (event) => {

      this.#mapEmbed.panBy(x, y);

    }

  }

}

export default __DEV__INTERFACE;