import React from 'react';
import MapInterface from './MapInterface';
import HTMLGen from './HTMLGen';
import { loader } from './index';
import background from './img/background_header-bg.png';
import header from './img/thumbnail_placekeeper-header-icon.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modal: null, places: [] };

    this.updatePlaces = this.updatePlaces.bind(this);
    this.importMap = this.importMap.bind(this);
    this.POSTMap = this.POSTMap.bind(this);
    this.GETMaps = this.GETMaps.bind(this);
    this.GETMap = this.GETMap.bind(this);
    this.showSaveModal = this.showSaveModal.bind(this);
    this.showImportModal = this.showImportModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    let modal = this.state.modal;

    return (
      <div className="PlaceKeeper">
        <header className="PK-header" style={{backgroundImage: `url(${background})`}}>
          
          <h1 className="site-title">PlaceKeeper</h1>
  
          <div className="header-image-container"><img className="header-image" src={`${header}`} alt="PlaceKeeper"/></div>
  
        </header>
  
        <main>
          <div className="content-container">

            <section className="map-and-buttons-container">
              <Map
                updatePlaces={this.updatePlaces}
              />
              <ModalButtons
                places={this.state.places}
                showImportModal={this.showImportModal}
                showSaveModal={this.showSaveModal}
              />
            </section>

            <section className="saved-places-container">
              <PlacesSearch />
              <PlacesList 
                places={this.state.places}
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
    this.setState({
      places: newPlaces
    });
  }

  async importMap(title) {
    const mapInterface = window.mapInterface;

    let mapPins = await this.GETMap(title).catch((err) => {

      console.error('[ERROR] ' + err);
      return [];

    });

    mapInterface.clearMap();
    mapInterface.loadMap(mapPins);

    this.closeModal();
  }

  POSTMap(title, places) {
    // MOCK

    console.log('post');

    let map = { title: title, hash: null, pins: [] };

    places.forEach((pin, i) => {

      map.pins[i] = { name: pin.name, lat: pin.latLng.lat(), lng: pin.latLng.lng() }
      if (pin.description)  map.pins[i].description = pin.description;

    });

    this.closeModal();
    console.log(map);
  }

  GETMaps() {

    let requestHEADER = new Headers({ 'Content-Type': 'application/json'});
    let requestGET = new Request('/API/getMaps', { method: 'GET', headers: requestHEADER });

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
    
    let requestHEADER = new Headers({ 'Content-Type': 'application/json'});
    let requestGET = new Request('/API/getMap/' + title, { method: 'GET', headers: requestHEADER });

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

  async showImportModal() {

    let maps = await this.GETMaps().catch((err) => { 

      return [];

    });

    this.setState({
      modal:
        <ImportModal
          maps={maps}
          importMap={this.importMap}
          closeModal={this.closeModal}
        />
    });

  }

  showSaveModal(givenState) {
    this.setState({
      modal:
        <SaveModal 
          places={givenState}
          POSTMap={this.POSTMap}
          closeModal={this.closeModal}
        />
    });
  }

  closeModal() {
    this.setState({
      modal: null
    });
  }
}

class Map extends React.Component {
  /*  Global vars generated and assigned here:
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
    // Initiate API connection, render map, and assign global vars.
    loader.load().then(() => {
      const google = window.google;
      const mapEvent = google.maps.event;
      const mapDOMNode = document.querySelector('#map');
    
      const mapEmbed = new google.maps.Map(document.querySelector('#map'), {
    
        center: { lat: 43.815136416911436, lng: -120.6398112171833 },
        zoom: 5,
        clickableIcons: false
    
      });

      const mapInterface  = new MapInterface(mapEmbed, mapDOMNode);

      window.mapEvent     = mapEvent;
      window.mapInterface = mapInterface;
      window.HTMLGen      = new HTMLGen();

      mapInterface.bindFunction(this.props.updatePlaces);
      mapEvent.addListenerOnce(mapEmbed, 'click', mapInterface.generateNewPin);
    });
    // End
  }
}

class ModalButtons extends React.Component {
  render() {
    return (
      <div className="import-and-save-buttons-container">

        <ImportButton
          showImportModal={this.props.showImportModal}
        />
        <SaveButton
          places={this.props.places}
          showSaveModal={this.props.showSaveModal}
        />

      </div>
    );
  }
}

class SaveButton extends React.Component {
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
    this.props.showImportModal(this.props.places);
  }
}

class PlacesList extends React.Component {
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
                key={place.latLng}
                name={place.name}
                description={place.description}
                latLng={place.latLng}
                removePlace={this.removePlace}
              />
            )}

          </ul>
        </div>

      </div>
    );
  }

  removePlace(placeLatLng) {
    const mapInterface = window.mapInterface;

    let pList = Array.from(this.props.places);
    let pListLatLngs = pList.map(place => place.latLng);
    let i = pListLatLngs.indexOf(placeLatLng);

    let pin = pList[i];

    mapInterface.removePin(pin);
  }
}

class PlacesSearch extends React.Component {
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
  /*  Expects props:
   *    - name
   *    - description (optional)
   *    - latLng
   */
  constructor(props) {
    super(props);

    this.state = { contents: null };

    this.panTo = this.panTo.bind(this);
    this.handleTrash = this.handleTrash.bind(this);
    this.confirmTrash = this.confirmTrash.bind(this);
    this.resetTrash = this.resetTrash.bind(this);

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
    const mapInterface = window.mapInterface;
    mapInterface.mapEmbed.panTo(this.props.latLng);
  }
  
  handleTrash() {
    this.setState({
      contents: <ConfirmText confirmTrash={this.confirmTrash} resetTrash={this.resetTrash}/>
    });
  }

  confirmTrash() {
    this.props.removePlace(this.props.latLng);
  }

  resetTrash() {
    this.setState({
      contents: <TrashButton handleTrash={this.handleTrash}/>
    });
  }
}

class TrashButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.handleTrash} type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
    );
  }
}

class ConfirmText extends React.Component {
  render() {
    return (
      <div className="are-you-sure">Are you sure?<i onClick={this.props.confirmTrash} className="fas fa-check-circle"></i><i onClick={this.props.resetTrash} className="fas fa-times-circle"></i></div>
    );
  }
}

class SaveModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { mapName: null };

    this.handleInput = this.handleInput.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  render() {
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
                  key={place.latLng}
                  name={place.name}
                  description={place.description}
                  latLng={place.latLng}
                />
              )}

            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button onClick={this.handleSave} type="button" className="modal-save-button action-button">Save</button>
          <button onClick={this.props.closeModal} type="button" className="modal-close-button action-button">Close</button>
        </div>

        </div>
      </div>
    );
  }

  handleInput(event) {
    this.setState({
      mapName: event.target.value
    });
  }

  handleSave() {

    if (this.props.places.length) {

      if (this.state.mapName) {

        this.props.POSTMap(this.state.mapName, this.props.places);
  
      } else {
  
        alert('You must enter a name for a new map.');
  
      }

    } else {

      alert('You cannot save an empty map.');

    }
  }
}

class TableRow extends React.Component {
  render () {
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
  render() {
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
              key={map.title}
              title={map.title}
              importMap={this.props.importMap}
            />
          )}

          </div>
        </div>

        <div className="modal-footer">
          <button onClick={this.props.closeModal} type="button" className="modal-close-button action-button">Close</button>
        </div>

        </div>
      </div>
    );
  }
}

class ImportEntry extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div onClick={this.handleClick} className="map-directory-entry-container">
        <i className="fas fa-file"></i><h4 className="file-title">{this.props.title}</h4> 
      </div>
    );
  }

  handleClick() {

    this.props.importMap(this.props.title);

  }
}

export default App;
