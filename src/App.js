import React from 'react';
import MapInterface from './MapInterface';
import HTMLGen from './HTMLGen';
import { loader } from './index';
import background from './img/background_header-bg.png';
import header from './img/thumbnail_placekeeper-header-icon.png';

const staticPlaces =
[
  {
    name: 'test1',
    description: 'testdesc1',
    latLng: (123, 456),
    lat: 123,
    lng: 456
  },
  {
    name: 'test2',
    description: 'testdesc2',
    latLng: (234, 567),
    lat: 234,
    lng: 567
  }
]

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modal: null, places: staticPlaces };

    this.updatePlaces = this.updatePlaces.bind(this);
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
            <Map
              updatePlaces={this.updatePlaces}
              showSaveModal={this.showSaveModal}
              showImportModal={this.showImportModal}
            />
            <PlacesList places={this.state.places}/>
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

  showSaveModal() {
    this.setState({
      modal: <SaveModal closeModal={this.closeModal}/>
    });
  }

  showImportModal() {
    this.setState({
      modal: <ImportModal closeModal={this.closeModal}/>
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
      <section className="map-container">
        <div id="map"></div>

        <div className="import-and-save-buttons-container">

          <ImportButton showImportModal={this.props.showImportModal}/>
          <SaveButton showSaveModal={this.props.showSaveModal}/>

        </div>
      </section>
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

class SaveButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="save-map-element">
        <button type="button" className="save-map-button" onClick={this.handleClick}>Save Map</button>
      </div>
    );
  }

  handleClick() {
    this.props.showSaveModal();
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
        <button type="button" className="import-map-button" onClick={this.handleClick}>Import Map</button>
      </div>
    );
  }

  handleClick() {
    this.props.showImportModal();
  }
}

class PlacesList extends React.Component {
  render() {
    return (
      <aside className="saved-places-container">

        <div className="search-bar-container">
          <div className="search-bar-element">
            <input type="text" name="filter-text" className="search-bar-input" />
          </div>
          <button className="search-bar-button">Search</button>
        </div>

        <div className="saved-places-list-parent">

          <h5 className="saved-places-list-title">Saved Places</h5>

          <div className="saved-places-filter-info hidden">

          </div>

          <div className="saved-places-list-container">
            <ul className="saved-places-list-element">

              {this.props.places.map(place => 
                <SavedPlace
                  key={place.latLng}
                  name={place.name}
                  description={place.description}
                  latLng={place.latLng}
                  lat={place.lat}
                  lng={place.lng}
                />
              )}

            </ul>
          </div>

        </div>

      </aside>
    );
  }
}

class SavedPlace extends React.Component {
  /*  Expects props:
   *    - name
   *    - description (optional)
   *    - latLng
   *    - lat
   *    - lng
   */

  render() {
    let description = null;
    
    if (this.props.description)
      description = this.props.description;

    return(
      <li key={this.props.latLng}>
        <div className="saved-place-entry" name={this.props.name} data-description={description} data-latlng={this.props.latLng}>

        <h5 className="saved-place-entry-title">{this.props.name}</h5>
        <button type="button" name="saved-place-entry-latLng" className="saved-place-entry-latLng">({this.props.lat}, {this.props.lng})</button>

        <div className="trash-button-container">
          <button type="button" name="trash-button" className="trash-button"><i className="far fa-trash-alt"></i></button>
        </div>

        </div>
      </li>
    );
  }
}

class SaveModal extends React.Component {
  render() {
    return (
      <div className="modal-backdrop save-modal">
        <div className="modal-container save-modal">

        <div className="modal-header">
          <h2 className="modal-title">Saving Map</h2>
          <button type="button" className="modal-x-button" onClick={this.props.closeModal}>&times;</button>
        </div>

        <div className="modal-input-container">
          <h1 className="modal-input-text">Map Name:</h1>
          <div className="modal-input-element">
            <input type="text" className="modal-input" />
          </div>
        </div>

        <div className="modal-description">
          <p>You're about to save the following locations:</p>
        </div>

        <div className="modal-body">
          <table className="modal-table">
            <tbody>
              <tr className="modal-table-header">
                <th className="modal-table-checkboxes"><input type="checkbox" className="modal-table-select-all" /></th>
                <th className="table-header-name">Pin Name</th>
                <th className="table-header-latitude">Latitude</th>
                <th className="table-header-longitude">Longitude</th>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-save-button action-button">Save</button>
          <button type="button" className="modal-close-button action-button" onClick={this.props.closeModal}>Close</button>
        </div>

        </div>
      </div>
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
          <button type="button" className="modal-x-button" onClick={this.props.closeModal}>&times;</button>
        </div>

        <div className="modal-description">
          <p>Available Maps:</p>
        </div>

        <div className="modal-body import-modal">
          <div className="modal-directory-container">

          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-close-button action-button" onClick={this.props.closeModal}>Close</button>
        </div>

        </div>
      </div>
    );
  }
}

export default App;
