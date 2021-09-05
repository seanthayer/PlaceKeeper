/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import Map          from 'components/Map';
import ModalButtons from 'components/ModalButtons';
import PlacesList   from 'components/PlacesList';
import PlacesSearch from 'components/PlacesSearch';
import SaveModal    from 'components/SaveModal';
import ImportModal  from 'components/ImportModal';

import { globalStyles } from 'global.styles';

import { Global }  from '@emotion/react';
import * as Styles from 'App.styles';

import background from 'img/background_header-bg.png';
import header     from 'img/thumbnail_placekeeper-header-icon.png';

import type { Pin } from 'map-API';

/* ------------------------------------------
 *
 *                COMPONENTS
 * 
 * ------------------------------------------
 * 
 *  Master List:
 * 
 *    - App
 *      - Map
 *      - ModalButtons
 *        - SaveButton
 *        - ImportButton
 *      - PlacesList
 *        - SavedPlace
 *      - PlacesSearch
 *      - SaveModal
 *        - TableRow
 *      - ImportModal
 *        - ImportEntry
 *      - MiniModal
 * 
 *    = Misc
 *      - TrashButton
 *      - ConfirmText
 *      
 * 
 * ------------------------------------------
 */

type State = app.component.rootApp.State;

class App extends React.Component<{}, State> {

  /*  Description:
   *    The main App component. Renders all sub-components directly related to App functionality. Handles logical interactions
   *    for updating the places list, sending HTTP requests to the server, and showing / closing modals.
   */

  constructor(props: State) {

    super(props);

    this.state = { modal: null, places: [] };

    this.updatePlaces     = this.updatePlaces.bind(this);
    this.importMap        = this.importMap.bind(this);
    this.saveMap          = this.saveMap.bind(this);
    this.removeMap        = this.removeMap.bind(this);
    this.POSTMap          = this.POSTMap.bind(this);
    this.GETMaps          = this.GETMaps.bind(this);
    this.GETMap           = this.GETMap.bind(this);
    this.DELETEMap        = this.DELETEMap.bind(this);
    this.showSaveModal    = this.showSaveModal.bind(this);
    this.showImportModal  = this.showImportModal.bind(this);
    this.closeModal       = this.closeModal.bind(this);

  }

  render() {

    let modal = this.state.modal;

    return (
      <div className="PlaceKeeper">

        <Global styles={globalStyles} />

        <header className="PK-header" style={{ backgroundImage: `url(${background})` }}>

          <h1 className="site-title" css={Styles.title}>PlaceKeeper</h1>

          <div className="header-image-container" css={Styles.imgContainer}><img className="header-image" css={Styles.imgSize} src={ `${header}` } alt="PlaceKeeper"/></div>

        </header>
  
        <main>

          <div className="content-container" css={Styles.contentContainer}>

            <section className="map-and-buttons-container" css={Styles.mapAndButtonsContainer}>

              <Map
                updatePlaces = {this.updatePlaces}
              />

              <ModalButtons
                places          = {this.state.places}
                showImportModal = {this.showImportModal}
                showSaveModal   = {this.showSaveModal}
              />

            </section>

            <section className="saved-places-container" css={Styles.savedPlacesContainer}>

              <PlacesSearch />

              <PlacesList
                places = {this.state.places}
              />

            </section>

          </div>

        </main>

        <div id="modal">

          {modal}

        </div>
  
      </div>
    );

  }

  updatePlaces(places: Array<Pin>) {

    /*  Description:
     *    When the Map component mounts, this function is bound to a constructed MapController class. This allows the class to
     *    update the App places list from outside the React hierarchy.
     */

    this.setState({

      places: places

    });

  }

  async importMap(title: string) {

    /*  Description:
     *    Clears the current map and renders a new one with the given title.
     */

    const mapController = window.mapController;

    let map = 
      await this.GETMap(title).catch((err) => {

        alert('Error getting map data.');
        return null;

      });

    // - - - -

    let mapPins = (map ? map.pins : null);

    if (mapPins) {

      mapController.clearMap();
      mapController.loadMap(mapPins);
  
      this.closeModal();

    }

  }

  async saveMap(title: string, places: Array<Pin>) {

    /*  Description:
     *    Saves a map with the given title and places list.
     */

    let map: app.map.POST = { title: title, pins: [] };
    let results;

    places.forEach((place, i) => {

      map.pins[i] = { 

        map         : title, 
        name        : place.name, 
        description : (place.description ? place.description : null), 
        lat         : place.latLng.lat(), 
        lng         : place.latLng.lng() 

      };

    });

    results = 
      await this.POSTMap(map).catch((err) => {

        alert('Error saving map data.');
        return null;

      });

    results && this.closeModal();

  }

  async removeMap(title: string) {

    /*  Description:
     *    Removes a map with the given title.
     */

    let results = 
      await this.DELETEMap(title).catch((err) => {

        alert('Error deleting map data.');
        return null;

      });

    if (results === 204) {

      this.showImportModal();

    }

  }

  POSTMap(map: app.map.POST): Promise<number> {

    /*  Description:
     *    Sends an HTTP POST request to the server with a map object. Returns a Promised response status, or error.
     */

    let requestHEADER = new Headers({ 'Content-Type': 'application/json'});
    let requestPOST   = new Request('/API/postMap', { method: 'POST', headers: requestHEADER, body: JSON.stringify(map) });

    return new Promise((resolve, reject) => {

      fetch(requestPOST).then((res) => {

        if (res.ok) {

          resolve(res.status);

        } else {

          throw res.status;

        }

      }).catch((err) => {

        console.error('[ERROR] ' + err);

        reject({

          error: err

        });

      });

    });

  }

  GETMaps(): Promise<Array<app.map.Metadata>> {

    /*  Description:
     *    Sends an HTTP GET request to the server. Returns a Promised array of objects with the server's current map titles, or error.
     */

    let requestHEADER = new Headers({ 'Content-Type': 'application/json'});
    let requestGET    = new Request('/API/getMaps', { method: 'GET', headers: requestHEADER });

    return new Promise((resolve, reject) => {

      fetch(requestGET).then((res) => {

        if (res.ok) {
  
          return res.json();
  
        } else {
  
          throw res.status;
  
        }
  
      }).then((mapTitles) => {

        resolve(mapTitles);

      }).catch((err) => {
  
        console.error('[ERROR] ' + err);

        reject({

          error: err

        });
  
      });

    });

  }

  GETMap(title: string): Promise<app.map.GET> {

    /*  Description:
     *    Sends an HTTP GET request to the server with a map title. Returns a Promised array of objects with the queried map pins, or error.
     */
    
    let requestHEADER = new Headers({ 'Content-Type': 'application/json'});
    let requestGET    = new Request('/API/getMap/' + title, { method: 'GET', headers: requestHEADER });

    return new Promise((resolve, reject) => {

      fetch(requestGET).then((res) => {

        if (res.ok) {
  
          return res.json();
  
        } else {
  
          throw res.status;
  
        }
  
      }).then((mapPins) => {

        resolve(mapPins);

      }).catch((err) => {
  
        console.error('[ERROR] ' + err);

        reject({

          error: err

        });
  
      });

    });

  }

  DELETEMap(title: string): Promise<number> {

    /*  Description:
     *    Sends an HTTP DELETE request to the server with a map title. Returns a Promised response status, or error.
     */

    let requestDELETE = new Request('/API/deleteMap/' + title, { method: 'DELETE' });

    return new Promise((resolve, reject) => {

      fetch(requestDELETE).then((res) => {

        if (res.ok) {
  
          resolve(res.status);
  
        } else {
  
          throw res.status;
  
        }

      }).catch((err) => {
  
        console.error('[ERROR] ' + err);

        reject({

          error: err

        });
  
      });

    });

  }

  async showImportModal() {

    /*  Description:
     *    Renders the import modal.
     */

    let maps =
      await this.GETMaps().catch((err) => { 

        return null;

      });

    if (maps)
    this.setState({

      modal:
        <ImportModal
          maps       = {maps}
          importMap  = {this.importMap}
          removeMap  = {this.removeMap}
          closeModal = {this.closeModal}
        />
      
    });

  }

  showSaveModal(placesList: Array<Pin>) {

    /*  Description:
     *    Renders the save modal with the given places list. This prevents reading a stale state value from the App component.
     */

    this.setState({

      modal:
        <SaveModal 
          places     = {placesList}
          GETMaps    = {this.GETMaps}
          saveMap    = {this.saveMap}
          closeModal = {this.closeModal}
        />
      
    });

  }

  closeModal() {

    /*  Description:
     *    Closes the rendered modal.
     */

    this.setState({

      modal: null

    });

  }

}

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export default App;
