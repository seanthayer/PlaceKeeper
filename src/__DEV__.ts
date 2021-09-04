// @ts-nocheck

class __DEV__ {

  #devAction;
  #globalVarIndex;

  constructor(mapEmbed) {

    const mapEvent = window.google.maps.event;

    this.#devAction = null;
    this.#globalVarIndex = 0;

    mapEvent.addListener(mapEmbed, 'click', (event) => {

      if (this.#devAction) {

        console.log('Here\'s what the event looks like' + event);
        console.log('And here\'s the latLng of the event' + event.latLng);

        this.#devAction();

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

  __DEV__LogToConsole(msg) {

    console.log('The next map click will log the argument\'s statement to the console.');
    
    this.#devAction = () => {

      console.log(msg);
      
    }

  }

}

export default __DEV__;