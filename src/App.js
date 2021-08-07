/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React        from 'react';
import MapInterface from './MapInterface';
import HTMLGen      from './HTMLGen';
import { loader }   from './index';
import background   from './img/background_header-bg.png';
import header       from './img/thumbnail_placekeeper-header-icon.png';

/* ------------------------------------------
 *
 *                COMPONENTS
 * 
 * ------------------------------------------
 * 
 *  List:
 * 
 *    - App
 *      - Map
 *      - ModalButtons
 *      - SaveButton
 *      - ImportButton
 *      - PlacesList
 *      - PlacesSearch
 *      - SavedPlace
 *      - TrashButton
 *      - ConfirmText
 *      - SaveModal
 *      - TableRow
 *      - ImportModal
 *      - ImportEntry
 *      - MiniModal
 * 
 * ------------------------------------------
 */

class App extends React.Component {

  /*  Description:
   *    The main App component. Renders all sub-components directly related to App functionality. Handles logical interactions
   *    for updating the places list, sending HTTP requests to the server, and showing / closing modals.
   */

  constructor(props) {

    super(props);

    this.state = { modal: null, places: [] };

    // Member functions
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

        <header className="PK-header" style={{ backgroundImage: `url(${background})` }}>

          <h1 className="site-title">PlaceKeeper</h1>

          <div className="header-image-container"><img className="header-image" src={ `${header}` } alt="PlaceKeeper"/></div>

        </header>
  
        <main>

          <div className="content-container">

            <section className="map-and-buttons-container">

              <Map
                updatePlaces = {this.updatePlaces}
              />

              <ModalButtons
                places          = {this.state.places}
                showImportModal = {this.showImportModal}
                showSaveModal   = {this.showSaveModal}
              />

            </section>

            <section className="saved-places-container">

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

  updatePlaces(newPlaces) {

    /*  Description:
     *    When the Map component mounts, this function is bound to a constructed MapInterface class. This allows the class to
     *    update the App places list from outside the React hierarchy.
     */

    this.setState({

      places: newPlaces

    });

  }

  async importMap(title) {

    /*  Description:
     *    Clears the current map and renders a new one with the given title.
     */

    const mapInterface = window.mapInterface;

    let mapPins = await this.GETMap(title).catch((err) => {

      alert('Error getting map data.');
      return null;

    });

    if (mapPins) {

      mapInterface.clearMap();
      mapInterface.loadMap(mapPins);
  
      this.closeModal();

    }

  }

  async saveMap(title, places) {

    /*  Description:
     *    Saves a map with the given title and places list.
     */

    let map = { title: title, pins: [] };
    let results;

    places.forEach((place, i) => {

      map.pins[i] = { 

        map         : title, 
        name        : place.name, 
        description : null, 
        lat         : place.latLng.lat(), 
        lng         : place.latLng.lng() 

      };

      if (place.description)
        map.pins[i].description = place.description;

    });

    results = await this.POSTMap(map).catch((err) => {

      alert('Error saving map data.');
      return null;

    });

    // 'results' will contain the pin insertIDs from the DB
    if (results) {

      this.closeModal();

    }

  }

  async removeMap(title) {

    /*  Description:
     *    Removes a map with the given title.
     */

    let results = await this.DELETEMap(title).catch((err) => {

      alert('Error deleting map data.');
      return null;

    });

    if (results === 204) {

      // **FIX: Causes visual glitching
      this.closeModal();
      this.showImportModal();

    }

  }

  POSTMap(map) {

    /*  Description:
     *    Sends an HTTP POST request to the server with a map object. Returns a Promised response status, or error.
     * 
     *  Expects:
     *    - map =>
     *        { 
     *          title:  'MAP_TITLE',
     *          pins:   [
     *                    {
     *                      map         : 'MAP_TITLE',
     *                      name        : 'PIN_NAME',
     *                      description : 'PIN_DESC',
     *                      lat         : 'PIN_LAT',
     *                      lng         : 'PIN_LNG'
     *                    },
     *                    . . .
     *                  ]
     *        }
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

  GETMaps() {

    /*  Description:
     *    Sends an HTTP GET request to the server. Returns a Promised array of objects with the server's current map titles, or error.
     *  
     *  Returns:
     *    [
     *      { title: 'MAP_TITLE' },
     *      . . .
     *    ]
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

  GETMap(title) {

    /*  Description:
     *    Sends an HTTP GET request to the server with a map title. Returns a Promised array of objects with the queried map pins, or error.
     *
     *  Returns:
     *    [
     *      {
     *        name        : 'PIN_NAME',
     *        description : 'PIN_DESC',
     *        lat         : 'PIN_LAT',
     *        lng         : 'PIN_LNG'
     *      },
     *      . . .
     *    ]
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

  DELETEMap(title) {

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

    let maps = await this.GETMaps().catch((err) => { 

      return [];

    });

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

  showSaveModal(placesList) {

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

class Map extends React.Component {

  /*  Description:
   *    The Map component, signifying the Google Maps embed. Renders a <div> element for the API to link. Upon mount, initiates
   *    API connection, map functionality classes, and global variables.
   * 
   *  Expects props:
   *    - updatePlaces => Function. Set a new state for App component, updating places list.
   *
   *  Global vars generated and assigned here:
   *    - window.google
   *    - window.mapEvent
   *    - window.mapInterface
   *    - window.HTMLGen
   */

  render() {

    return (
      <div id="map"></div>
    );

  }

  componentDidMount() {

    // Initiate API connection, construct map functionality classes, and assign global vars.

    loader.load().then(() => {

      const google      = window.google;
      const mapEvent    = google.maps.event;
      const mapDOMNode  = document.querySelector('#map');
    
      const mapEmbed = new google.maps.Map(document.querySelector('#map'), {
    
        center         : { lat: 43.815136416911436, lng: -120.6398112171833 },
        zoom           : 5,
        clickableIcons : false
    
      });

      const mapInterface  = new MapInterface(mapEmbed, mapDOMNode);

      window.mapEvent     = mapEvent;
      window.mapInterface = mapInterface;
      window.HTMLGen      = new HTMLGen();

      // Pass the updatePlaces function to MapInterface. Allows synchronising the map embed and React elements' pin lists.
      mapInterface.updatePlaces = this.props.updatePlaces;

      // This single-use click listener prevents multiple new pin forms from being opened on the map.
      // The MapInterface class then re-generates it whenever the form is closed or a new pin is created.
      mapEvent.addListenerOnce(mapEmbed, 'click', mapInterface.generateNewPin);

    });
    
  }

}

class ModalButtons extends React.Component {

  /*  Description:
   *    Renders import and save buttons.
   *  
   *  Expects props:
   *    - showImportModal => Function. Render the import modal.
   *    - showSaveModal   => Function. Render the save modal.
   *    - places          => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */

  render() {

    return (
      <div className="import-and-save-buttons-container">

        <ImportButton
          showImportModal = {this.props.showImportModal}
        />

        <SaveButton
          places        = {this.props.places}
          showSaveModal = {this.props.showSaveModal}
        />

      </div>
    );

  }

}

class SaveButton extends React.Component {

  /*  Description:
   *    Renders the save modal on click.
   *  
   *  Expects props:
   *    - showSaveModal => Function. Render the save modal.
   *    - places        => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */

  constructor(props) {

    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  render() {

    return (
      <div className="save-map-element">

        <button onClick={this.handleClick} type="button" className="save-map-button">Save Map</button>

      </div>
    );

  }

  handleClick() {

    this.props.showSaveModal(this.props.places);

  }

}

class ImportButton extends React.Component {

  /*  Description:
   *    Renders the import modal on click.
   *  
   *  Expects props:
   *    - showImportModal => Function. Render the import modal.
   */

  constructor(props) {

    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  render() {

    return (
      <div className="import-map-element">

        <button onClick={this.handleClick} type="button" className="import-map-button">Import Map</button>

      </div>
    );

  }

  handleClick() {

    this.props.showImportModal();

  }

}

class PlacesList extends React.Component {

  /*  Description:
   *    Renders the saved places list using SavedPlace sub-components. Can handle removal of a pin from within the list via the
   *    removePlace member function.
   * 
   *  Expects props:
   *    - places => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */
  
  constructor(props) {

    super(props);
    this.removePlace = this.removePlace.bind(this);

  }

  render() {

    return (
      <div className="saved-places-list-parent">

        <h5 className="saved-places-list-title">Saved Places</h5>

        <div className="saved-places-list-container">
          <ul className="saved-places-list-element">

            {this.props.places.map(place => 
              <SavedPlace
                key         = {place.latLng}
                name        = {place.name}
                description = {place.description}
                latLng      = {place.latLng}
                removePlace = {this.removePlace}
              />
            )}

          </ul>
        </div>

      </div>
    );

  }

  removePlace(placeLatLng) {

    /*  Description:
     *    Removes a pin from the map using the given latLng.
     */

    const mapInterface = window.mapInterface;

    let pList         = Array.from(this.props.places);
    let pListLatLngs  = pList.map(place => place.latLng);
    let i             = pListLatLngs.indexOf(placeLatLng);

    let pin = pList[i];

    mapInterface.removePin(pin);

  }

}

class PlacesSearch extends React.Component {

  // **FIX: Incomplete.

  /*  Description:
   *    No current functionality. Renders the saved places search bar.
   */

  render() {

    return (
      <div className="search-bar-container">
        <div className="search-bar-element">

          <input type="text" name="filter-text" className="search-bar-input" />

        </div>

        <button className="search-bar-button">Search</button>

      </div>
    );

  }

}

class SavedPlace extends React.Component {

  /*  Description:
   *    Renders a saved place list item, representing the information of a pin on the current map. Can handle panning
   *    to a pin and can call to remove a pin.
   *
   *  Expects props:
   *    - removePlace => Function. Remove a pin from the map using the given latLng.
   *    - name        => The entry's name.
   *    - description => The entry's description. Currently not displayed and only kept as data. (Optional)
   *    - latLng      => The entry's latitude and longitude on the map embed.
   */

  constructor(props) {

    super(props);

    this.state = { contents: null };

    // Member functions
    this.panTo        = this.panTo.bind(this);
    this.handleTrash  = this.handleTrash.bind(this);
    this.confirmTrash = this.confirmTrash.bind(this);
    this.resetTrash   = this.resetTrash.bind(this);

    // After the handleTrash member function is bound, render the TrashButton with the functionality.
    this.state.contents = <TrashButton handleTrash={this.handleTrash}/>

  }

  render() {

    let description = null;
    
    if (this.props.description)
      description = this.props.description;

    return(
      <li>
        <div className="saved-place-entry" name={this.props.name} data-description={description} data-latlng={this.props.latLng}>

        <h5 className="saved-place-entry-title">{this.props.name}</h5>
        <button onClick={this.panTo} type="button" name="saved-place-entry-latLng" className="saved-place-entry-latLng">({this.props.latLng.lat()}, {this.props.latLng.lng()})</button>

        <div className="trash-button-container">
          
          {this.state.contents}

        </div>

        </div>
      </li>
    );

  }

  panTo() {

    /*  Description:
     *    Pans the map embed to the current entry's latLng.
     */

    const mapInterface = window.mapInterface;
    mapInterface.mapEmbed.panTo(this.props.latLng);

  }
  
  handleTrash() {

    /*  Description:
     *    Prompts confirmation from the user.
     */

    this.setState({

      contents: <ConfirmText confirm={this.confirmTrash} reset={this.resetTrash}/>

    });

  }

  confirmTrash() {

    /*  Description:
     *    Calls removePlace with the current entry's latLng.
     */

    this.props.removePlace(this.props.latLng);

  }

  resetTrash() {

    /*  Description:
     *    Resets the entry's contents.
     */

    this.setState({

      contents: <TrashButton handleTrash={this.handleTrash}/>

    });

  }

}

class TrashButton extends React.Component {

  /*  Description:
   *    Renders a trash button. Calls a handleTrash function on click.
   *
   *  Expects props:
   *    - handleTrash => Function. Handle the functionality for trash button click.
   */

  render() {

    return (
      <button onClick={this.props.handleTrash} type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
    );

  }

}

class ConfirmText extends React.Component {

  /*  Description:
   *    Renders a user confirmation prompt. Calls a confirmation or reset function, depending on click.
   *
   *  Expects props:
   *    - confirm => Function. Handle the functionality for confirm button click.
   *    - reset   => Function. Handle the functionality for reset button click.
   */

  render() {

    return (
      <div className="are-you-sure">Are you sure?<i onClick={this.props.confirm} className="fas fa-check-circle"></i><i onClick={this.props.reset} className="fas fa-times-circle"></i></div>
    );

  }

}

class SaveModal extends React.Component {

  /*  Description:
   *    Renders the save modal using information from the places list to populate TableRow sub-components. Can handle consolidating input
   *    of a new map and can call to save the new map to the server.
   * 
   *  Expects props:
   *    - closeModal  => Function. Close the modal.
   *    - GETMaps     => Function. GET titles of the maps on the server.
   *    - saveMap     => Function. Save the current map.
   *    - places      => 
   *        [
   *          { Pin },
   *          . . . 
   *        ]
   */

  constructor(props) {

    super(props);

    this.state = { mapName: null, submodal: null };

    // Member functions
    this.closeSubModal  = this.closeSubModal.bind(this);
    this.handleInput    = this.handleInput.bind(this);
    this.handleSave     = this.handleSave.bind(this);
    this.writeMap       = this.writeMap.bind(this);

  }

  render() {

    let submodal = this.state.submodal;

    return (
      <div className="modal-backdrop save-modal">
        <div className="modal-container save-modal">

        <div className="modal-header">

          <h2 className="modal-title">Saving Map</h2>
          <button onClick={this.props.closeModal} type="button" className="modal-x-button">&times;</button>

        </div>

        <div className="modal-input-container">
          <h1 className="modal-input-text">Map Name:</h1>

          <div className="modal-input-element">
            <input onChange={this.handleInput} type="text" className="modal-input" maxLength="25" placeholder="Max 25 characters" />
          </div>

        </div>

        <div className="modal-description">
          <p>You're about to save the following locations:</p>
        </div>

        <div className="modal-body save-modal">

          <table className="modal-table">
            <tbody>

              <tr className="modal-table-header">
                <th className="table-header-name">Pin Name</th>
                <th className="table-header-latitude">Latitude</th>
                <th className="table-header-longitude">Longitude</th>
              </tr>

              {this.props.places.map(place => 
                <TableRow
                  key         = {place.latLng}
                  name        = {place.name}
                  description = {place.description}
                  latLng      = {place.latLng}
                />
              )}

            </tbody>
          </table>

        </div>

        <div className="modal-footer">

          <button onClick={this.handleSave} type="button" className="modal-save-button action-button">Save</button>
          <button onClick={this.props.closeModal} type="button" className="modal-close-button action-button">Close</button>

        </div>

        <div id="sub-modal">

          {submodal}

        </div>

        </div>
      </div>
    );

  }

  closeSubModal() {

    this.setState({ 

      submodal: null

    });

  }

  handleInput(event) {

    /*  Description:
     *    Records the map name inputted by the user.
     */

    this.setState({

      mapName: event.target.value

    });

  }

  async handleSave() {

    /*  Description:
     *    Consolidate map and pin information to save on the server.
     */

    let sanitizedTitle  = (this.state.mapName ? this.state.mapName.match(/\w+/gi) : null); // Sanitize input; Note: removes accented chars as well
    let newMapTitle     = (sanitizedTitle     ? sanitizedTitle.join('')           : null);

    let modalContent  = { message: null, confirmText: null, closeText: null };
    let numOfPins     = this.props.places.length;
    let mapTitles     = [];

    if (numOfPins) {

      if (newMapTitle) {

        mapTitles = await this.props.GETMaps().catch((err) => {

          return [];
    
        });

        mapTitles = mapTitles.map( (e) => { return e.title; } );

        // Check if the current name will overwrite an existing map.
        if ( mapTitles.includes(newMapTitle) ) {

          modalContent = { message: 'This will overwrite an existing map. Are you sure?', confirmText: 'Yes', closeText: 'No' };

          this.setState({

            submodal: 
              <MiniModal 
                modalContent = {modalContent}
                confirm      = { () => {this.writeMap(newMapTitle, this.props.places)} }
                close        = {this.closeSubModal}
              /> 
            
          });

        } else {

          this.writeMap(newMapTitle, this.props.places);

        }
  
      } else {
  
        alert('You must enter a name for a new map.');
  
      }

    } else {

      alert('You cannot save an empty map.');

    }

  }

  writeMap(title, places) {

    /*  Description:
     *    Calls to save the map with title and places, then calls to close the modal.
     */

    this.props.saveMap(title, places);
    this.props.closeModal();

  }

}

class TableRow extends React.Component {

  /*  Description:
   *    Renders a table row with the specified name, description, and latitude & longitude.
   *
   *  Expects props:
   *    - name        => The row's name.
   *    - description => The row's description. Currently not displayed and only kept as data. (Optional)
   *    - latLng      => The row's latitude and longitude.
   */

  render() {

    return (
      <tr className="modal-table-row" data-name={this.props.name} data-description={this.props.description} data-latlng={this.props.latLng}>

        <td className="table-row-name">{this.props.name}</td>
        <td className="table-row-latitude">{this.props.latLng.lat()}</td>
        <td className="table-row-longitude">{this.props.latLng.lng()}</td>

      </tr>
    );

  }

}

class ImportModal extends React.Component {

  /*  Description:
   *    Renders the import modal, generating entries from the server map list. Can call to delete or load a map from the server.
   * 
   *  Expects props:
   *    - closeModal  => Function. Close the modal.
   *    - importMap   => Function. Import a map, given a title.
   *    - removeMap   => Function. Remove a map, given a title.
   *    - maps        => 
   *        [
   *          { title: 'MAP_TITLE' },
   *          . . .
   *        ]
   */
  
  constructor(props) {

    super(props);

    this.state = { submodal: null };

    // Member functions
    this.closeSubModal = this.closeSubModal.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.showEntryInfo = this.showEntryInfo.bind(this);

  }

  render() {

    let submodal = this.state.submodal;

    return (
      <div className="modal-backdrop import-modal">
        <div className="modal-container import-modal">

        <div className="modal-header">

          <h2 className="modal-title">Import Map</h2>
          <button onClick={this.props.closeModal} type="button" className="modal-x-button">&times;</button>

        </div>

        <div className="modal-description">
          <p>Available Maps:</p>
        </div>

        <div className="modal-body import-modal">
          <div className="modal-directory-container">

          {this.props.maps.map(map => 
            <ImportEntry
              key           = {map.title}
              title         = {map.title}
              showEntryInfo = {this.showEntryInfo}
            />
          )}

          </div>
        </div>

        <div className="modal-footer">

          <button onClick={this.props.closeModal} type="button" className="modal-close-button action-button">Close</button>

        </div>

        <div id="sub-modal">

          {submodal}
          
        </div>

        </div>
      </div>
    );

  }

  closeSubModal() {

    this.setState({ 

      submodal: null

    });

  }

  confirmDelete(title) {

    /*  Description:
     *    Prompts the user to confirm a delete action on a map. Uses the sub-modal.
     */

    let modalContent = { message: `This will permanently delete map '${title}'. Are you sure?`, confirmText: 'Yes', closeText: 'No' };

    this.closeSubModal();

    this.setState({

      submodal:
        <MiniModal 
          modalContent = {modalContent}
          confirm      = { () => {this.props.removeMap(title)} }
          close        = {this.closeSubModal}
        />

    });

  }

  showEntryInfo(title) {

    /*  Description:
     *    Renders the sub-modal, listing the selected entry's title and three action buttons (Load, Delete, Close).
     */

    let modalContent = { message: `Map title: ${title}`, confirmText: 'Load', closeText: 'Delete', tertiaryText: 'Close' };

    this.setState({

      submodal:
        <MiniModal 
          modalContent = {modalContent}
          confirm      = { () => {this.props.importMap(title)} }
          close        = { () => {this.confirmDelete(title)} }
          tertiary     = {this.closeSubModal}
        /> 

    });

  }

}

class ImportEntry extends React.Component {

  /*  Description:
   *    Renders an import entry. Calls to show entry info on click.
   * 
   *  Expects props:
   *    - showEntryInfo => Function. Show the information for the current entry, given a title.
   *    - title         => The current entry's title.
   */

  render() {

    return (
      <div onClick={ () => {this.props.showEntryInfo(this.props.title)} } className="map-directory-entry-container">

        <i className="fas fa-file"></i><h4 className="file-title">{this.props.title}</h4> 

      </div>
    );

  }

}

class MiniModal extends React.Component {

  /*  Description:
   *    Renders a mini modal for small confirmation menus, etc. 
   * 
   *  Expects props:
   *    - modalContent =>
   *        {
   *          message      : 'BODY_TEXT',
   *          confirmText  : 'CONFIRM_BUTTON_TEXT',
   *          closeText    : 'CLOSE_BUTTON_TEXT',
   *          tertiaryText : 'TERTIARY_BUTTON_TEXT' (Optional)
   *        }
   */
  
  render() {

    let message       = this.props.modalContent.message;
    let confirmText   = this.props.modalContent.confirmText;
    let closeText     = this.props.modalContent.closeText;
    let tertiaryText  = this.props.modalContent.tertiaryText;

    let confirmButton   = (confirmText  ? <button onClick={this.props.confirm} type="button" className="yes-button action-button">{confirmText}</button>        : null);
    let closeButton     = (closeText    ? <button onClick={this.props.close} type="button" className="no-button action-button">{closeText}</button>             : null);
    let tertiaryButton  = (tertiaryText ? <button onClick={this.props.tertiary} type="button" className="tertiary-button action-button">{tertiaryText}</button> : null);

    return (
      <div className="modal-backdrop confirm-modal">
        <div className="modal-container confirm-modal">

        <div className="modal-body confirm-modal">
          <div className="modal-text confirm-modal">

            {message}

          </div> 
        </div>

        <div className="modal-footer confirm-modal">

          {confirmButton}
          {closeButton}
          {tertiaryButton}

        </div>

        </div>
      </div>
    );

  }

}

/* ------------------------------------------
 *
 *                  EXPORT
 * 
 * ------------------------------------------
 */

export default App;
