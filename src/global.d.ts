/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import type { Pin } from 'map-API';
import React from 'react';

/* ------------------------------------------
 *
 *                DECLARATIONS
 * 
 * ------------------------------------------
 */

export = app;
export as namespace app;

declare global {

  interface Window {

    mapDOMNode    : HTMLDivElement;
    mapController : MapController;

    DEV: any;

  }

}

declare namespace app {

  declare module "*.png";

   namespace component {

    namespace rootApp {

      interface State {

        modal: React.ReactElement | null;
        places: Array<Pin>;
      
      }

    }

    namespace importModal {

      namespace entry {

        interface Props {

          title: string;

          showEntryInfo(title: string): void;

        }
      
      }

      interface Props {
      
        maps: Array<app.map.Metadata>;

        closeModal(): void;
        importMap(title: string): void;
        removeMap(title: string): void;
      
      }

      interface State {

        submodal: React.ReactElement | null;
      
      }

    }

    namespace saveModal {

      namespace row {

        interface Props extends app.pin.Data {}

      }

      interface Props {
      
        places : Array<Pin>;

        closeModal(): void;
        GETMaps(): Promise<Array<app.map.Metadata>>;
        saveMap(title: string, places: Array<Pin>): void;
      
      }

      interface State {

        mapName: string | null;
        submodal: React.ReactElement | null;
      
      }

    }

    namespace miniModal {

      interface Props {

        content: {

          message       : string;
          confirmText   : string;
          closeText     : string;
          tertiaryText? : string;

        }

        actionPrimary(): void;
        actionSecondary(): void;
        actionTertiary: (() => void) | undefined;

      }

    }

    namespace modalButtons {

      interface SaveProps {

        places: Array<Pin>;
        showSaveModal(placesList: Array<Pin>): void;

      }

      interface ImportProps {

        showImportModal(): void;

      }

      interface Props extends SaveProps, ImportProps {}

    }

    namespace placesList {

      namespace place {

        interface Props extends app.pin.Data {

          removePlace(latLng: google.maps.LatLng): void;

        }

      }

      interface Props {

        places: Array<Pin>;

      }

    }

    namespace placesSearch {

      // Component not implemented.

    }

    namespace misc {

      namespace trashButton {

        namespace actionButton {

          interface Props {

            handle(): void;

          }

        }

        namespace confirmText {

          interface Props {
  
            confirm(): void;
            reset(): void;
  
          }
  
        }

        interface Props {

          handleTrash(): void;

        }

        interface State {
          
          content: React.ReactElement | null;

        }

      }

    }

    namespace embedded {

      interface Intrinsic {

        cleanUp(): void;

      }

      namespace pinInfo {

        interface Elemental {

          pin: Pin;

        }

        interface Props extends Intrinsic, Elemental {}

      }

    }

  }

  // - - - -

  namespace handler {

    interface HTMLGen {

      NewPinForm(context: { cleanUp?(): void }): React.ReactElement;
    
    }

    interface API {

      generateLatLng(coords: number | google.maps.LatLngLiteral): google.maps.LatLng | null;
    
      generateMarker(map: google.maps.Map, pos?: google.maps.LatLng): google.maps.Marker | null;
      
      generateInfoBox<T>(
        opt?: { pos: google.maps.LatLng, html: string | React.ComponentClass<app.component.embedded.Intrinsic & T>, closeClick?(): void }
      ): { window: google.maps.InfoWindow, DOMNode?: HTMLDivElement, element?: React.ReactElement<T>, cleanUp?(): void } | null;
    
    }

  }

  // - - - -

  namespace map {

    interface POST {

      title: string;
      pins: Array<app.pin.POST>;

    }

    interface GET {

      meta: app.map.Metadata;
      pins: Array<app.pin.GET>;

    }

    interface Metadata {

      title: string;
      createdAt: string;

    }

  }

  // - - - -
  
  namespace pin {
  
    interface InfoBox {
  
      window   : google.maps.InfoWindow;
      DOMNode  : HTMLDivElement;
    
    }
    
    interface Primitive {
    
      name        : string;
      description : string | null;
      lat         : string | number;
      lng         : string | number;
    
    }
    
    interface POST extends Primitive {
    
      map: string;
    
    }
    
    interface GET extends Primitive {
    
      createdAt: string;
    
    }
    
    interface Prototype {
    
      marker  : google.maps.Marker;
      infoBox : app.pin.InfoBox | null;
      latLng  : google.maps.LatLng;
    
    }
    
    interface Data {
    
      name         : string;
      description? : string;
      latLng       : google.maps.LatLng;
    
    }
  
    interface Object extends Prototype, Data {}
  
  }

}
