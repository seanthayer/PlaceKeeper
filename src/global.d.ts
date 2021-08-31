declare module "*.png";

declare namespace app {

   namespace component {

    namespace rootApp {

      interface State {

        modal  : ReactElement | null;
        places : Array<Pin>;
      
      }

    }

    namespace importModal {

      interface Props {

        closeModal(): void;
        importMap(title: string): void;
        removeMap(title: string): void;
      
        maps: Array<app.map.Metadata>;
      
      }

      interface State {

        submodal: ReactElement | null;
      
      }

      namespace entry {

        interface Props {

          showEntryInfo(title: string): void;

          title: string;

        }
      
      }

    }

    namespace saveModal {



    }

    namespace miniModal {

      interface Props {

        actionPrimary(): void;
        actionSecondary(): void;
        actionTertiary: (() => void) | undefined;

        content: {

          message       : string;
          confirmText   : string;
          closeText     : string;
          tertiaryText? : string;

        }

      }

    }

    namespace modalButtons {

      interface SaveProps {

        showSaveModal(placesList: Array<Pin>): void;
        places: Array<Pin>;

      }

      interface ImportProps {

        showImportModal(): void;

      }

      interface Props extends SaveProps, ImportProps {}

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

  namespace dom {

    interface HTMLGen {

      NewPinForm(context: { latLng: google.maps.LatLng | google.maps.LatLngLiteral }): string;
    
      PinInfo(context: { latLng: google.maps.LatLng | google.maps.LatLngLiteral, name: string, description?: string }): string;
    
      TrashButton(): string;
      ConfirmText(): string;
    
    }

  }

  // - - - -

  namespace map {

    interface POST {

      title : string;
      pins  : Array<app.pin.POST>;

    }

    interface GET {

      meta: app.map.Metadata;
      pins: Array<app.pin.GET>;

    }

    interface Metadata {

      title: string;
      createdAt: string;

    }

    interface API {

      generateLatLng(coords: number | google.maps.LatLngLiteral): google.maps.LatLng | null;
    
      generateMarker(map: google.maps.Map, pos?: google.maps.LatLng): google.maps.Marker | null;
      
      generateInfoBox(opt?: { pos?: google.maps.LatLng, html?: string }): google.maps.InfoWindow | null;
    
    }

  }

  // - - - -
  
  namespace pin {
  
    interface InfoBox {
  
      window   : google.maps.InfoWindow;
      DOMNode  : HTMLDivElement;
    
    }
    
    interface Primitive {
    
      name          : string;
      description   : string | null;
      lat           : string | number;
      lng           : string | number;
    
    }
    
    interface POST extends Primitive {
    
      map: string;
    
    }
    
    interface GET extends Primitive {
    
      createdAt: string;
    
    }
    
    interface Prototype {
    
      marker: google.maps.Marker;
      infoBox: pin.InfoBox | null;
      latLng: google.maps.LatLng;
    
    }
    
    interface Data {
    
      name         : string;
      description? : string;
      latLng       : google.maps.LatLng;
    
    }
  
    interface Object extends Prototype, Data {}
  
  }

}
