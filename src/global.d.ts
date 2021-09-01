/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import type { Pin } from 'MapAPI';

/* ------------------------------------------
 *
 *                DECLARATIONS
 * 
 * ------------------------------------------
 */

export = app;
export as namespace app;

declare namespace app {

  declare module "*.png";

   namespace component {

    namespace rootApp {

      interface State {

        modal: ReactElement | null;
        places: Array<Pin>;
      
      }

    }

    namespace importModal {

      interface Props {
      
        maps: Array<app.map.Metadata>;

        closeModal(): void;
        importMap(title: string): void;
        removeMap(title: string): void;
      
      }

      interface State {

        submodal: ReactElement | null;
      
      }

      namespace entry {

        interface Props {

          title: string;

          showEntryInfo(title: string): void;

        }
      
      }

    }

    namespace saveModal {

      interface Props {
      
        places : Array<Pin>;

        closeModal(): void;
        GETMaps(): Promise<Array<app.map.Metadata>>;
        saveMap(title: string, places: Array<Pin>): void;
      
      }

      interface State {

        mapName: string | null;
        submodal: ReactElement | null;
      
      }

      namespace row {

        interface Props extends app.pin.Data {}

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

      interface Props {

        places: Array<Pin>;

      }

      namespace place {

        interface Props extends app.pin.Data {

          removePlace(latLng: google.maps.LatLng): void;

        }

        interface State {

          contents: ReactElement | null;

        }

      }

    }

    namespace placesSearch {

      // Component not implemented.

    }

    namespace misc {

      namespace trashButton {

        interface Props {

          handleTrash(): void;

        }

      }

      namespace confirmText {

        interface Props {

          confirm(): void;
          reset(): void;

        }

      }

    }

  }

  // - - - -

  namespace handler {

    interface HTMLGen {

      NewPinForm(context: { latLng: google.maps.LatLng | google.maps.LatLngLiteral }): string;
    
      PinInfo(context: { latLng: google.maps.LatLng | google.maps.LatLngLiteral, name: string, description?: string }): string;
    
      TrashButton(): string;
      ConfirmText(): string;
    
    }

    interface API {

      generateLatLng(coords: number | google.maps.LatLngLiteral): google.maps.LatLng | null;
    
      generateMarker(map: google.maps.Map, pos?: google.maps.LatLng): google.maps.Marker | null;
      
      generateInfoBox(opt?: { pos?: google.maps.LatLng, html?: string }): google.maps.InfoWindow | null;
    
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
  
      window  : google.maps.InfoWindow;
      DOMNode : HTMLDivElement;
    
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
