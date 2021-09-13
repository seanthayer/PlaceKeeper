// @ts-nocheck

import PrimitiveElement from "__DEV/components/PrimitiveElement";
import { renderComponent } from "reactmap-lib/reactmap";

// this.N.style[d] = this.O.style[d] = "translate(" + this.j.Pa + "px," + this.j.Qa + "px)",
// this.N.style.willChange = this.O.style.willChange = "transform";

function parsePixelCoord(latLng, zoom) {

  let scale = 1 << zoom;

  let worldCoord = project(latLng);

  return new google.maps.Point(

    Math.floor(worldCoord.x * scale),
    Math.floor(worldCoord.y * scale)

  );

}

function project(latLng: google.maps.LatLng) {

  // Projection function courtesy of Google's documentation

  const TILE_SIZE = 256;

  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );

}

class __DEV__INTERFACE {

  #mapEmbed;
  
  #devAction;
  #globalVarIndex;

  #origin;

  #x;
  #y;

  #lat;
  #lng;

  constructor(mapEmbed) {

    const mapEvent = window.google.maps.event;

    this.#mapEmbed = mapEmbed;

    this.#devAction = null;
    this.#globalVarIndex = 0;

    this.#origin = parsePixelCoord( mapEmbed.getCenter(), mapEmbed.getZoom() );

    this.#lat = mapEmbed.getCenter().lat();
    this.#lng = mapEmbed.getCenter().lng();

    this.#x = 0;
    this.#y = 0;

    /*
    mapEvent.addListener(mapEmbed, 'center_changed', (event) => {

      // let infoWindow;
      // let infoLat, infoLng = 0;

      // if (this.#globalVarIndex > 0) {

      //   infoWindow = window.global1;

      //   infoLat = window.global1.getPosition().lat();
      //   infoLng = window.global1.getPosition().lng();

      //   console.log('Lat from origin: ', infoLat - this.#mapEmbed.getCenter().lat());
      //   console.log('Lng from origin: ', infoLng - this.#mapEmbed.getCenter().lng());

      // }

      // console.log(this.#origin);

      let pixelCoord = parsePixelCoord(mapEmbed.getCenter(), mapEmbed.getZoom());

      let diffX = pixelCoord.x - this.#origin.x;
      let diffY = pixelCoord.y - this.#origin.y;

      console.log();
      console.log('-----------------------------------------------');

      console.log('Center change event,');
      console.log('(x, y):');
      console.log(`--> origin: (${this.#origin.x}, ${this.#origin.y})`);
      console.log(`--> new:    (${pixelCoord.x}, ${pixelCoord.y})`);
      console.log(`------------------------------`);
      console.log(`--> diff:   (${diffX}, ${diffY})`);

      console.log('-----------------------------------------------');

      console.log('(lat, lng):');
      console.log(`--> origin: (${this.#lat}, ${this.#lng})`);

      this.#lat = mapEmbed.getCenter().lat();
      this.#lng = mapEmbed.getCenter().lng();

      console.log(`--> new:    (${this.#lat}, ${this.#lng})`);

      console.log('-----------------------------------------------');
      console.log();

      this.#origin = pixelCoord;

    });
    */

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

    // - - - - 

    /*

    mapEvent.addListener(mapEmbed, 'dragstart', () => {

      console.log();
      console.log('-----------------------------------------------');

      console.log('Drag-start event, here\'s the center');
      console.log(this.#mapEmbed.getCenter().lat(), this.#mapEmbed.getCenter().lng());

      console.log('-----------------------------------------------');

      this.#lat = this.#mapEmbed.getCenter().lat();
      this.#lng = this.#mapEmbed.getCenter().lng();

      console.log('Current lat: ', this.#lat);
      console.log('Current lng: ', this.#lng);

      console.log('-----------------------------------------------');
      console.log();

    });

    // - - - - 

    mapEvent.addListener(mapEmbed, 'dragend', () => {

      console.log();
      console.log('-----------------------------------------------');

      console.log('Drag-end event, here\'s the center');
      console.log(this.#mapEmbed.getCenter().lat(), this.#mapEmbed.getCenter().lng());

      this.#lat = (this.#mapEmbed.getCenter().lat() - this.#lat);
      this.#lng = (this.#mapEmbed.getCenter().lng() - this.#lng);

      console.log('-----------------------------------------------');

      console.log('Difference in lat: ', this.#lat);
      console.log('Difference in lng: ', this.#lng);

      console.log('-----------------------------------------------');
      console.log();

    });

    */

  }

  __DEV__ExposeMapAPI() {

    window.map = this.#mapEmbed;

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

  /*
  __DEV__FindAverageChange() {

    const iStart = 0;
    const iEnd = 5000;

    let lat = 0;
    // let lng = 0;

    let oldLat;
    // let oldLng = this.#mapEmbed.getCenter().lng();

    let newLat = this.#mapEmbed.getCenter().lat();

    let startIncrement;
    let endIncrement;

    let increment;
    let i;

    for (i = iStart; i < iEnd; i++) {

      oldLat = newLat;

      this.#mapEmbed.panBy(0, -1);

      newLat = this.#mapEmbed.getCenter().lat();
      
      increment = (newLat - oldLat);
      (i === iStart) && (startIncrement = increment);
      (i === (iEnd - 1)) && (endIncrement = increment);

      console.log('Increment: ', increment);      
      console.log('New lat: ', newLat);      
      console.log('Old lat: ', oldLat);

      lat += increment;
      
    }

    console.log('Accumulated latitude: ', lat);
    console.log(`Panned ${i} pixels on the y-axis`);

    console.log('Increment start: ', startIncrement);
    console.log('Increment end: ', endIncrement);
    console.log('Increment changed by: ', startIncrement - endIncrement);

    console.log('Average increment: ', (lat / i));
    
  }
  */

}

export default __DEV__INTERFACE;