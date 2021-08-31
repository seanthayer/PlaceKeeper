declare module "*.png";

declare namespace app {

  declare namespace dom {

    interface HTMLGen {

      NewPinForm(context: { latLng: google.maps.LatLng | google.maps.LatLngLiteral }): string;
    
      PinInfo(context: { latLng: google.maps.LatLng | google.maps.LatLngLiteral, name: string, description?: string }): string;
    
      TrashButton(): string;
      ConfirmText(): string;
    
    }

  }

  // - - - -

  declare namespace map {

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
  
  declare namespace pin {
  
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
